import styled from "styled-components";
import { useQuery } from "react-query";
import {
  IGetDataResult,
  LIST_TYPE,
  getNowPlayingTv,
  getPopularTv,
} from "../api";
import Slider from "../Components/Slider";
import Banner from "../Components/Banner";

const Tv = () => {
  // useQuery는 2가지 argument가 필요함. (queryKey: query의 고유식별자 / fetcher함수)
  // react query는 이 key를 보고 우리의 query를 인식한다. 또한 이 key를 array로 감싸서 인식한다.
  // nowplaying
  const { data: nowPlayingTv, isLoading } = useQuery<IGetDataResult>(
    [LIST_TYPE[3], "nowPlayingTv"],
    getNowPlayingTv
  );
  console.log("nowPlayingTv", nowPlayingTv, isLoading);

  // upcoming
  const { data: popularTv } = useQuery<IGetDataResult>(
    [LIST_TYPE[4], "popularTv"],
    getPopularTv
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner data={nowPlayingTv as IGetDataResult} />

          <SliderContainer>
            <Slider
              data={nowPlayingTv as IGetDataResult} // 타입 단언은 타입스크립트가 개발자의 말만 믿고 Duck 타입으로 인식하여 빈 객체임에도 에러를 발생시키지 않는다.
              title={"Now Playing"}
              listType={LIST_TYPE[3]}
              menuName={"tv"}
              mediaType={"tv"}
            />
            <Slider
              data={popularTv as IGetDataResult}
              title={"Popular Tv Shows"}
              listType={LIST_TYPE[4]}
              menuName={"tv"}
              mediaType={"tv"}
            />
          </SliderContainer>
        </>
      )}
    </Wrapper>
  );
};

export default Tv;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SliderContainer = styled.div``;
