import styled from "styled-components";
import { makeImagePath } from "../utils";
import { IGetMoviesResult } from "../api";

const Banner = ({ data }: { data: IGetMoviesResult }) => {
  return (
    <Wrapper
      $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")} // $bgPhoto로 써줘야 콘솔에 오류가 안나더라..
    >
      <Title>{data?.results[0].title}</Title>
      <Overview>{data?.results[0].overview}</Overview>
    </Wrapper>
  );
};

export default Banner;

const Wrapper = styled.div<{ $bgPhoto: string }>`
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
