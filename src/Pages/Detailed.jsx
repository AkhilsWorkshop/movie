import axios from "axios";
import { fullSizeImg, halfSizeImg } from "../config/config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { AiTwotoneStar } from "react-icons/ai"
import Header from "../components/Main/Header";
import Footer from "../components/Main/Footer";
import Loading from "../components/Main/Loading";
import { FaExternalLinkAlt } from "react-icons/fa";
import Recommendations from "../components/Cards/DetailedCard/Recommendations";
import Cast from "../components/Cards/DetailedCard/Cast";
import Production from "../components/Cards/DetailedCard/Production";


const Detailed = () => {

    // Video API 
    const fetchVideoData = async () => {
        const { data } = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${searchID}/videos?api_key=${process.env.REACT_APP_API_KEY}`)
        setVideo(data.results[0]?.key)
    }

    // Storing the data from API 
    const [video, setVideo] = useState();

    const videoURL = `https://www.youtube.com/watch?v=${video}`
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Getting the ID from URL
    const { mediaType, searchID } = useParams()

    // Movie Details API
    const getMovieDetails = async () => {
        setLoading(true)
        const { data } = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${searchID}?api_key=${process.env.REACT_APP_API_KEY}`);
        setData(data)
        setLoading(false)
        console.log(data)
    }

    useEffect(() => {
        getMovieDetails()
        fetchVideoData()
    }, [])

    return (
        <div>
            <Header />
            {
                loading ? (
                    <Loading />
                )
                    :
                    (<div className="flex flex-col md:flex-col">


                        <div className="text-white bg-cover" Style={`background-image: url(${fullSizeImg}${data.backdrop_path})`} >

                            <div className="flex flex-col justify-center p-5 md:px-72 backdrop-blur-md backdrop-brightness-50 bg-gradient-to-b via-transparent from-transparent to-gray-900 gap-5">

                                <div className="flex">
                                    <h1 className="border-l-4 pl-2 border-yellow-500 text-lg md:text-2xl sm:text-4xl">{data.title || data.name}
                                        {data.original_language !== "en" ?
                                            <span className="text-base md:text-xl sm:text-2xl"> ({data.original_title || data.original_name})</span>
                                            :
                                            <></>
                                        }
                                    </h1>
                                </div>

                                <div className="flex justify-between items-start gap-4">
                                    <img
                                        src={halfSizeImg + data.poster_path}
                                        alt={data.original_title}
                                        className="object-fill h-72 shadow-2xl shadow-black border border-gray-700"
                                    />
                                    <div className="flex flex-col items-start sm:items-end gap-5">

                                        <>
                                            {
                                                data.homepage === "" ?
                                                    <></>
                                                    :
                                                    <div onClick={(e) => {
                                                        e.preventDefault();
                                                        window.location.href = data.homepage;
                                                    }}>
                                                        <FaExternalLinkAlt size={20} className=" text-gray-300 cursor-pointer hover:text-white" />
                                                    </div>
                                            }
                                        </>

                                        <div className="flex items-center gap-1">
                                            <AiTwotoneStar size={30} className="text-yellow-400" />
                                            <h1 className="text-2xl font-bold">{Math.round(data.vote_average)}<span className="text-lg text-slate-400">/10</span></h1>
                                        </div>

                                        <p className="text-slate-400 text-sm gap-1 flex flex-wrap items-end">
                                            {data.genres?.map(({ id, name }) => (
                                                <span key={id} className="text-white border border-gray-400 px-1 rounded-md"> {name}</span>
                                            ))}
                                        </p>

                                        {
                                            mediaType === "movie"
                                            &&
                                            <div className="flex items-center gap-1">
                                                <h1 className="text-xl font-bold">{Math.round(data.runtime)}<span className="text-lg text-slate-400 font-normal"> min</span></h1>
                                            </div>
                                        }

                                        <div className="flex flex-col gap-1 items-start sm:items-end">

                                            <p className="text-slate-400 text-sm">Country:
                                                {data.production_countries?.map(({ id, name }) => (
                                                    <span key={id} className="text-white font-bold"> {name}</span>
                                                ))}
                                            </p>

                                            <p className="text-slate-400 text-sm">Released: <span className="text-white font-bold">{data.first_air_date || data.release_date || "N/A"}</span></p>

                                            <p className="text-slate-400 text-sm">Language:
                                                {data.spoken_languages?.map(({ id, name, english_name }) => {
                                                    return english_name ?
                                                        (
                                                            <span key={id} className="text-white font-bold"> {english_name}</span>
                                                        )
                                                        :
                                                        (
                                                            <span key={id} className="text-white font-bold"> {name}</span>
                                                        )
                                                }
                                                )}
                                            </p>

                                        </div>

                                    </div>
                                </div>

                                <div className="flex flex-col">

                                    <p className="text-white text-base">{data.overview}</p>

                                </div>

                                <div className="flex flex-col overflow-x-hidden gap-5" >
                                    <h1 className="border-l-4 pl-2 border-yellow-500 text-lg md:text-2xl sm:text-4xl">Cast</h1>
                                    <div className="flex flex-wrap">

                                        <Cast mediaType={mediaType} searchID={searchID} />

                                    </div>
                                </div>
                                <>

                                    <Production companies={data.production_companies} />

                                </>
                            </div>

                        </div>

                        <>

                            {video === undefined ?
                                <></>
                                :
                                <div className="text-white flex flex-col justify-center p-5 md:px-72 backdrop-blur-md backdrop-brightness-50 bg-gradient-to-b from-gray-900 to-gray-900 gap-5">
                                    <div className="flex flex-col gap-5 flex-nowrap">
                                        <h1 className="border-l-4 pl-2 border-yellow-500 text-lg md:text-2xl sm:text-4xl">Videos</h1>
                                        <div className="flex ">
                                            <ReactPlayer className="" url={videoURL} />
                                        </div>

                                    </div>
                                </div>
                            }

                        </>

                        <>
                            <Recommendations id={data.id} mediaType={mediaType} />
                        </>




                    </div>)
            }
            <Footer />
        </div>
    )
}

export default Detailed
