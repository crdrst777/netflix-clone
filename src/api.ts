const API_KEY = "b18e798ff377ef49f1c335283e7c43d6";
const BASE_PATH = "https://api.themoviedb.org/3";

export const LIST_TYPE = [
  "nowPlayingMovies",
  "upcomingMovies",
  "popularMovies",
  "nowPlayingTv",
  "popularTv",
];

// movie
interface IData {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
  vote_average: string;
  release_date?: string;
}

export interface IGetDataResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IData[];
  total_pages: number;
  total_results: number;
}

export interface IGenre {
  id: number;
  name: string;
}
interface INetworks {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}
export interface IDetailInfo {
  id: number;
  overview: string;
  title?: string;
  original_title?: string;
  name?: string;
  vote_average: number;
  runtime: number;
  backdrop_path: string;
  poster_path: string;
  genres: IGenre[];
  release_date?: string;
  first_air_date?: string;
  networks: INetworks[];
  tagline?: string;
}

// fetcher는 데이터를 받아오고 JSON을 리턴하는 함수

// Movies - NowPlaying
export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Movies - Popular
export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Movies - Upcoming
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Modal Popup getDetail Info Api
export function getDetailData(requestUrl: string, movieId: number) {
  return fetch(`${BASE_PATH}/${requestUrl}/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Tv - NowPlaying
export function getNowPlayingTv() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Tv - Popular
export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
