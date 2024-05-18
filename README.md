# goent
go entertainment site test dummy
https://jaydenbusterz.github.io/goent/

## Data Update Guide

* 이미지 준비
이미지의 파일명은 추후 유지보수를 위해 형식을 통일한다.

**특수문자없이 영문으로만 작성하며,
이미지의 용량은 해상도가 무너지기 직전까지 최대한 용량을 압축하여 준비한다.**

년도월날짜_가수명_공연장.png
ex) 20240518_brunoMas_gochukdom.png

준비된 이미지를 [imgur.com](https://imgur.com) 에 업로드 후,
해당 이미지의 주소(url)을 복사한다
이때의 주소는 게시글의 주소가 아닌,
이미지 우클릭 후 ‘주소복사’시에 나타나는 이미지경로(url)를 의미한다.

이하 서술되는 모든 이미지경로(url 주소)는 위와 같이 준비한다.

imgur사이트를 이미지서버 대용으로 사용하고 있으나,
해당 사이트는 계정당 최대 225개,
이미지 하나 당 업로드시 최대 20MB를 제한한다.
이미지의 용량은 위 imgur의 사이트를 기준으로 하지 않으며, 자사의 사이트내의 이미지 부하로 네트워크 딜레이가 심하게 걸릴게 된다.
이에 최소한으로 용량을 줄여 이미지를 준비하여 업로드 해야한다. 

***

데이터는 깃헙 저장소 내 data폴더에서 관리한다.
각 데이터의 노출순서는
**위에서 아래로 작성된 순서로 노출됨으로 이 점 유의하여 작성한다.** 
이하 각 데이터 파일의 구분

* Home 섹션
textBanner.json
메인 뷰 하단 띠배너에 들어가는 데이터

데이터 구성 형식
```javascript
{
    "textBanner": [
        {
            "tit": "ariana grande",
            "date": "23.aug",
            "place": "고척돔"
        },
        {
            "tit": "NAS",
            "date": "23.june",
            "place": "올릭핌경기장"
        }
    ]
}
```
데이터 추가 시 ,따옴표 작성 후 {} 괄호 안에 위와 같은 형식으로
{
    "tit": "가수명",
    "data": "년도.월",
    "place": "공연장"
}
형태로 구성하여 작성한다. 이해가 안간다면,
위 내용을 복사해서 붙히고 반드시 내용만 변경하면 된다.
따옴표를 작성해야하며, 마지막 데이터 하단에는 따옴표가 없어야된다.


* Now we are 섹션
nowwe.json
좌/우로 움직이는 포스터 슬라이드 데이터

데이터 구성 형식
```javascript
{
    "nowwe": [
        {
            "img": "https://i.imgur.com/9pTOZld.jpeg",
            "tit": "poster tit",
            "des": "poster des"
        },
        {
            "img": "https://i.imgur.com/8IneA0B.jpeg",
            "tit": "poster tit",
            "des": "poster des"
        }
    ]
}
```
위에서 서술한 데이터 추가 방식과 동일하며,
tit(타이틀)과 des(상세내용)은 굳이 작성을 안해도 되지만, 이미지 url 주소만 보고
해당 데이터가 어떤 데이터인지 알 수 없기에 데이터 확인을 위해 작성하는걸 추천.

* History 섹션
history.json
년도로 구분짓는 탭 슬라이드 데이터

데이터 구성 형식
```javascript
[
    {
        "year": "2024",
        "list": [
            {
                "img": "./img/dummy-poster.jpg",
                "tit": "2024 tit 0",
                "des": "2024 des 0"
            },
            {
                "img": "https://i.imgur.com/AdtWxJd.jpeg",
                "tit": "2024 tit 1",
                "des": "2024 des 1"
            }
        ]
    },
    {
        "year": "2023",
        "list": [
            {
                "img": "./img/people.png",
                "tit": "2023 tit 0",
                "des": "2023 des 0"
            },
            {
                "img": "./img/people.png",
                "tit": "2023 tit 1",
                "des": "2023 des 1"
            }
        ]
    }
]
```
json 데이터 타입의 형식과 구조는 모두 동일한 방식을 갖고있다.
위에서 서술한 데이터 방식과 동일하지만,
해당 데이터에서의 차이점은 년도 데이터를 추가해야만 좌측의 타이틀이 생성된다.
연도에 해당하는 행사 데이터는 'list' 배열안에 데이터를 추가해야하며,
{
    "img": "이미지 경로",
    "tit": "제목",
    "des": "상세내용"
}
형태로 구성된다.