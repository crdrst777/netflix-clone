import styled from "styled-components";
import { motion } from "framer-motion";
import { getDetailData, IDetailInfo } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

interface IModalProps {
  dataId: number;
  listType: string;
  menuName: string;
  requestUrl: string;
}

const Modal = ({ dataId, listType, menuName, requestUrl }: IModalProps) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const bigMatch = useMatch(`/${menuName}/${listType}/:movieId`);
  // useMatch는 이 route 안에 있는지 다른 곳에 있는지 알려줌. -->  string | null
  console.log("bigMatch", bigMatch);
  console.log("dataId", dataId);
  const onOverlayClick = () => navigate(-1);

  const { data } = useQuery<IDetailInfo>(
    [listType + dataId, "detail" + dataId],
    () => getDetailData(requestUrl, dataId)
  );

  console.log("data", data);

  // 클릭한 영화 찾기 (객체형태) -> 사용자가 클릭한 movieId를 이용해서, results에서 해당 영화 찾기
  // const clickedMovie = data?.results.find(
  //   (movie) => movie.id === +bigMatch.params.movieId!
  // );
  // // bigMatch?.params.movieId 가 true라면 (썸네일을 클릭한 상태라면), data.results 안을 탐색
  // // find 함수는 ()안에 넣는 조건을 만족하는 가장 첫번째 항목을 반환한다.
  // // movie.id가 bigMatch.params.movieId와 같은 movie를 찾는다.
  // // bigMatch.params.movieId 가 string이라서 동일하게 number로 변환해줌(앞에 +써주면됨)
  // // data?.results --> 영화들로 이루어진 배열임.
  // console.log("clickedMovie", clickedMovie);

  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <BigMovie
        layoutId={bigMatch?.params.movieId + "" + listType}
        // style={{ top: scrollY.get() + 100 }}
        // motion value에 숫자를 더하려면 .get()를 해줘야함. (100px의 마진을 줬음)
      >
        {/* clickedMovie가 있으면 <>...</> */}
        {data && (
          <>
            <BigCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                  data.backdrop_path,
                  "w500"
                )})`,
              }}
            />
            <BigTitle>{data.title}</BigTitle>
            <BigOverview>{data.overview}</BigOverview>
          </>
        )}
      </BigMovie>
    </>
  );
};

export default Modal;

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
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -80px;
`;
