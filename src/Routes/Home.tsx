import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";

const Home = () => {
  // useQuery는 2가지 argument가 필요함. (queryKey: query의 고유식별자 / fetcher함수)
  // react query는 이 key를 보고 우리의 query를 인식한다. 또한 이 key를 array로 감싸서 인식한다.
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data, isLoading);

  return (
    <div style={{ backgroundColor: "whitesmoke", height: "200vh" }}>home</div>
  );
};

export default Home;
