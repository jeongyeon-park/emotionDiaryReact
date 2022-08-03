import { useRef, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { DiaryDispatchContext } from '../App';

import MyHeader from './MyHeader'
import MyButton from './MyButton'
import EmotionItem from './EmotionItem';

import { getStringDate } from '../util/date';

const emotionList = [
    {
        emotion_id: 1,
        emotion_img: process.env.PUBLIC_URL + `/assets/emotion1.png`,
        emotion_descript: '완전 좋음'
    },
    {
        emotion_id: 2,
        emotion_img: process.env.PUBLIC_URL + `/assets/emotion2.png`,
        emotion_descript: '좋음'
    },
    {
        emotion_id: 3,
        emotion_img: process.env.PUBLIC_URL + `/assets/emotion3.png`,
        emotion_descript: '그럭저럭'
    },
    {
        emotion_id: 4,
        emotion_img: process.env.PUBLIC_URL + `/assets/emotion4.png`,
        emotion_descript: '나쁨'
    },
    {
        emotion_id: 5,
        emotion_img: process.env.PUBLIC_URL + `/assets/emotion5.png`,
        emotion_descript: '끔찍함'
    }
]

const DiaryEditor = ({ isEdit, originData }) => {

    const contentRef = useRef();
    const [content, setContent] = useState("");
    const [emotion, setEmotion] = useState(3);
    const [date, setDate] = useState(getStringDate(new Date()));

    const { onCreate, onRemove, onEdit } = useContext(DiaryDispatchContext)

    useEffect(() => {
        if (isEdit) {
            setDate(getStringDate(new Date(parseInt(originData.date))));
            setEmotion(originData.emotion);
            setContent(originData.content);
        }
    }, [isEdit, originData]);

    const handleClickEmote = (emotion) => {
        setEmotion(emotion);
    }

    const handleSubmit = () => {
        if (!content.length) {
            contentRef.current.focus();
            return;
        }

        if (window.confirm(isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?")) {
            if (!isEdit) {
                onCreate(date, content, emotion);
            } else {
                onEdit(originData.id, date, content, emotion);
            }
        }

        navigate('/', { replace: true }) // 옵션을 줘서 뒤로가기를 막을 수 있다. 
    }

    const handleRemove = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            onRemove(originData.id);
            navigate('/', { replace: true });
        }
    }

    const navigate = useNavigate();
    return (
        <div className='DiaryEditor'>
            <MyHeader
                headText={isEdit ? "일기 수정하기" : "새로운 일기 쓰기"}
                leftChild={<MyButton text={"< 뒤로가기"}
                    onClick={() => navigate(-1)} />}
                rightChild={isEdit ? <MyButton text={"삭제하기"} type={"negative"} onClick={handleRemove} /> : ""}
            />

            <div>
                <section>
                    <h4>오늘은 언제인가요? </h4>
                    <div className='input_box'>
                        <input
                            className='input_date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                        />
                    </div>
                </section>

                <setction>
                    <h4>오늘의 감정</h4>
                    <div className='input_box emotion_list_wrapper'>
                        {emotionList.map((it) => (
                            <EmotionItem
                                key={it.emotion_id}
                                {...it}
                                onClick={handleClickEmote}
                                isSelected={it.emotion_id === emotion}
                            />
                        ))}
                    </div>
                </setction>

                <section>
                    <h4>오늘의 일기</h4>
                    <div className='input_box text_wrapper'>
                        <textarea placeholder='오늘은 어땠나요?' ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                </section>

                <section>
                    <div className='control_box'>
                        <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
                        <MyButton text={"작성완료"} type={"positive"} onClick={handleSubmit} />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DiaryEditor;