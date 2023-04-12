import styled from "styled-components";
import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  LIST_TYPE,
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
} from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";

const Home = () => {
  // useQuery는 2가지 argument가 필요함. (queryKey: query의 고유식별자 / fetcher함수)
  // react query는 이 key를 보고 우리의 query를 인식한다. 또한 이 key를 array로 감싸서 인식한다.
  // nowplaying
  const { data: nowPlayingMovies, isLoading } = useQuery<IGetMoviesResult>(
    [LIST_TYPE[0], "nowPlayingMovies"],
    getNowPlayingMovies
  );
  console.log("nowPlayingMovies", nowPlayingMovies, isLoading);

  // upcoming
  const { data: upcomingMovies } = useQuery<IGetMoviesResult>(
    [LIST_TYPE[1], "upcomingMovies"],
    getUpcomingMovies
  );

  // popular
  const { data: PopularMovies } = useQuery<IGetMoviesResult>(
    [LIST_TYPE[2], "PopularMovies"],
    getPopularMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(
              nowPlayingMovies?.results[0].backdrop_path || ""
            )} // $bgPhoto로 써줘야 콘솔에 오류가 안나더라..
          >
            <Title>{nowPlayingMovies?.results[0].title}</Title>
            <Overview>{nowPlayingMovies?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <Slider
              data={nowPlayingMovies as IGetMoviesResult} // 타입 단언은 타입스크립트가 개발자의 말만 믿고 Duck 타입으로 인식하여 빈 객체임에도 에러를 발생시키지 않는다.
              title={"NOW PLAYING"}
              listType={LIST_TYPE[0]}
              menuName={"home"}
              mediaType={"movie"}
            />
            <Slider
              data={upcomingMovies as IGetMoviesResult} // 타입 단언은 타입스크립트가 개발자의 말만 믿고 Duck 타입으로 인식하여 빈 객체임에도 에러를 발생시키지 않는다.
              title={"UPCOMING MOVIES"}
              listType={LIST_TYPE[1]}
              menuName={"home"}
              mediaType={"movie"}
            />
            <Slider
              data={PopularMovies as IGetMoviesResult} // 타입 단언은 타입스크립트가 개발자의 말만 믿고 Duck 타입으로 인식하여 빈 객체임에도 에러를 발생시키지 않는다.
              title={"POPULAR MOVIES"}
              listType={LIST_TYPE[2]}
              menuName={"home"}
              mediaType={"movie"}
            />
          </SliderContainer>
        </>
      )}
    </Wrapper>
  );
};

export default Home;

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

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  // 두 배경을 갖는다. linear-gradient와 url
  background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      ${(props) => props.theme.black.veryDark}
    ),
    url(${(props) => props.$bgPhoto});
  /* background-color: wheat; */
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const SliderContainer = styled.div``;
