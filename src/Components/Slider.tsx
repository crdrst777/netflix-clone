import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { ReactComponent as ArrowRight } from "../assets/icon/arrow-right.svg";
import Modal from "../Components/Modal";

interface ISliderProps {
  data: IGetMoviesResult;
  title: string;
  listType: string;
  menuName: string;
  mediaType: string;
}

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const boxVarients = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -28,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
    boxShadow: "0 0 8px 3px rgba(0, 0, 0, 0.45)",
  },
};

const infoVarients = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};

const offset = 6;

const Slider = ({
  data,
  title,
  listType,
  menuName,
  mediaType,
}: ISliderProps) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const bigMatch: PathMatch<string> | null = useMatch(
    `/${menuName}/${listType}/:movieId`
  );

  // const { scrollY } = useScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false); // 빠르게 연속으로 두번 클릭하면 슬라이더가 이동하면서 중간이 비게 되는 버그가 발생하는걸 방지하기 위한 코드
  const increaseIndex = () => {
    if (data) {
      if (leaving) return; // 처음 클릭할때는 leaving이 false지만, 두번 클릭하면 true가 되고, 인덱스를 +1할거임
      toggleLeaving();
      const totalMovies = data.results.length - 1; // 첫영화는 배너에 들어가니깐 제외
      const maxIndex = Math.floor(totalMovies / offset) - 1; // index = page
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1)); // maxIndex면 다시 0으로
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (menu: string, type: string, movieId: number) => {
    // navigate(`/${menu}/${movieId}`); // 이 url로 바꿔줌.
    navigate(`/${menu}/${type}/${movieId}`); // 이 url로 바꿔줌.
  };

  // const dragWrapperRef = useRef<HTMLDivElement>(null); // 드래그 영역 부모 잡기위해 useRef사용

  return (
    <Wrapper>
      <SliderTitle>{title}</SliderTitle>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        {/* onExitComplete -> exit이 끝났을떼 실행되는 함수. 빠르게 연속으로 두번 클릭한 후 또 클릭할때 슬라이더가 넘어가지 않은 현상을 방지하기 위한 코드 */}
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }} // type: "tween" -> 튕기는게 없어짐
          key={index}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                key={movie.id}
                whileHover="hover" // 자식인 <Info/>에도 상속됨
                initial="normal"
                variants={boxVarients}
                onClick={() => onBoxClicked(menuName, listType, movie.id)}
                transition={{ type: "tween" }}
              >
                <Poster
                  layoutId={movie.id + "" + listType} // layoutId는 string이어야함
                  $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                />
                <Info variants={infoVarients}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
        <ArrowRightBtn onClick={increaseIndex}>
          <ArrowRight
            style={{
              fill: "white",
              width: "32px",
              height: "32px",
            }}
          />
        </ArrowRightBtn>
      </AnimatePresence>

      <AnimatePresence>
        {bigMatch ? (
          <Modal
            dataId={Number(bigMatch?.params.movieId)}
            listType={listType}
            menuName={menuName}
            requestUrl={mediaType}
          />
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
};

export default Slider;

const Wrapper = styled.div`
  position: relative;
  top: -196px;
  margin-bottom: 200px;
  /* overflow: hidden; */
`;

const SliderTitle = styled.h3`
  padding: 0 0 11px 60px;
  font-size: 24px;
  font-weight: 500;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 60px;
  margin: 0 0 96px 0;
`;

const Box = styled(motion.div)``;

const Poster = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 150px;
  /* 230 130 */
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
  }
`;

const ArrowRightBtn = styled.button`
  position: absolute;
  right: 0;
  width: 60px;
  height: 130px;
  &:hover {
    background-color: ${(props) => props.theme.black.lighter};
  }
`;
