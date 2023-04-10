import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { IGetMoviesResult, getMoviesNowPlaying } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";
import NowPlayingSlider from "../Components/MovieSlider/NowPlayingSlider";
import UpcomingSlider from "../Components/MovieSlider/UpcomingSlider";

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
    getMoviesNowPlaying
  );
  console.log("nowPlaying", data, isLoading);
  const onOverlayClick = () => navigate(-1);
  // 클릭한 영화 찾기 (객체형태) -> 사용자가 클릭한 movieId를 이용해서, results에서 해당 영화 찾기
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
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")} // $bgPhoto로 써줘야 콘솔에 오류가 안나더라..
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            {data ? <NowPlayingSlider data={data} /> : null}
            <UpcomingSlider />
          </SliderContainer>
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
                >
                  {/* clickedMovie가 있으면 <>...</> */}
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
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
