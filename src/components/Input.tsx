import React, { useContext } from 'react'
import { ThemeContext } from "../App";
import styled from 'styled-components';
import { Col, Row } from "react-bootstrap";

const TextArea = styled.textarea`
    border: none;
    border-radius: 4px;
    overflow: auto; 
    width: 100%;       
    &:hover,
    &:focus {
    outline: none;
    }

    &::placeholder {
    font-size: 20px;
    }

`

const Colu = styled(Col)`

    padding:1px;
    z-index: 0;

`

const DownloadAll = styled.button`
    min-width: 100px;
    padding: 16px 32px;
    border-radius: 4px;
    border: none;
    background: #141414;
    color: #fff;
    font-size: 24px;
    cursor: pointer;  
`

const Rowu = styled(Row)`
    margin: 0;
`



const Input = () => {

    const { ChangeQuality, setIsError, SetWaning, AllDetail, SetAllDetail, setCardLoading, setPlayListLoading, Path } = useContext(ThemeContext)

    const All_Download_Video = (Quality: string) => {


        AllDetail.map(async (data: any) => {
            const { Video_url, ext } = data.videoquality[Quality]
            await window.eel.Download_video({ title: data.title, urlvideo: Video_url, url: data.url, path: Path, audiourl: data.videoquality['m4a'].Video_url, ext: ext })
                (() => {

                })
            return 0;
        })
    }


    const Get_Detail = async (Url: String) => {




        setIsError(false)

        // eslint-disable-next-line
        var re = new RegExp(`https:\/\/www\.youtube\.com\/watch?.*=...........`);
        // eslint-disable-next-line
        var playlist = new RegExp(`https://www.youtube.com/playlist`);
        SetAllDetail({ type: 'empty' });
        SetWaning([]);

        if (Url === "") {
            return 0;
        }

        const AllUrl = Url.split('\n')

        // this function come from python line 17 in main.py 
        // then call this function then it will run in python
        // after it will get all details of youtube a video 
        // through 'message'  and all details stored value to AllDetails 
        // split mean 2 url in textarea into ["url", "url"]


        for (let i = 0; i < AllUrl.length; i++) {

            let url = AllUrl[i]

            if (url !== "") {
                if (url.match(re)) {
                    if (AllDetail.every((obj: any) => obj.url !== url)) {
                        setCardLoading(true)
                        await window.eel.Add_Details(url)((message: any) => {

                            if (message !== true) {
                                SetAllDetail({ message, type: 'add' });
                            }
                            setCardLoading(false)


                        })
                    }
                } else if (url.match(playlist)) {
                    setPlayListLoading(true)
                    await window.eel.Get_Data_Details_Playlists(url)((data: Array<any>) => {

                        data.map((message: any) => {
                            if (message !== true) {
                                SetAllDetail({ message, type: 'add' });
                            }
                            return 0;
                        })
                        setPlayListLoading(false)
                    })
                }
                else {
                    SetWaning((arr: any) => [...arr, url]);
                }
            }
        }


        return false;



    }





    return (
            <Rowu>
                <Colu xs={9} >
                    <TextArea placeholder="Enter multiple url youtube video " rows={3}  onChange={(e) => Get_Detail(e.target.value)} />
                </Colu>
                <Colu xs={3}>
                    <DownloadAll disabled={AllDetail.length === 0} type="button" onClick={() => All_Download_Video(ChangeQuality.quality)}>Download</DownloadAll>
                </Colu>
            </Rowu>
    )
}


export { Input }