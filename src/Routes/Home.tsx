import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

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
    y: -80,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};

const infoVarients = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};

const offset = 6;

const Home = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const bigMovieMatch = useMatch("/movies/:movieId");
  // useMatch는 이 route 안에 있는지 다른 곳에 있는지 알려줌. -->  string | null
  // console.log("bigMovieMatch", bigMovieMatch);
  const { scrollY } = useScroll();
  // useQuery는 2가지 argument가 필요함. (queryKey: query의 고유식별자 / fetcher함수)
  // react query는 이 key를 보고 우리의 query를 인식한다. 또한 이 key를 array로 감싸서 인식한다.
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data, isLoading);
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
  const onBoxClicked = (movieId: number) => {
    navigate(`movies/${movieId}`); // 이 url로 바꿔줌.
  };
  const onOverlayClick = () => navigate(-1);
  // 클릭한 영화 찾기 (객체형태)
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId!);
  // bigMovieMatch?.params.movieId 가 true라면 (썸네일을 클릭한 상태라면), data.results 안을 탐색
  // find 함수는 ()안에 넣는 조건을 만족하는 가장 첫번째 항목을 반환한다.
  // movie.id가 bigMovieMatch.params.movieId와 같은 movie를 찾는다.
  // bigMovieMatch.params.movieId 가 string이라서 동일하게 number로 변환해줌(앞에 +써주면됨)
  // data?.results --> 영화들로 이루어진 배열임.
  console.log("clickedMovie", clickedMovie);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
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
                      layoutId={movie.id + ""} // layoutId는 string이어야함
                      key={movie.id}
                      whileHover="hover" // 자식인 <Info/>에도 상속됨
                      initial="normal"
                      variants={boxVarients}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVarients}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId + ""}
                  style={{ top: scrollY.get() + 100 }}
                  // motion value에 숫자를 더하려면 .get()를 해줘야함. (100px의 마진을 줬음)
                />
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  // 두 배경을 갖는다. linear-gradient와 url
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;
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
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: red;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
