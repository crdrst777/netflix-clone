import styled from "styled-components";
import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import { makeImagePath } from "../utils";

const Home = () => {
  // useQuery는 2가지 argument가 필요함. (queryKey: query의 고유식별자 / fetcher함수)
  // react query는 이 key를 보고 우리의 query를 인식한다. 또한 이 key를 array로 감싸서 인식한다.
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data, isLoading);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 이 데이터가 없다면 그냥 ""를 보여주기 */}
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
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
