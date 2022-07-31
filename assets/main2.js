const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");

//1. 타일 만들기 - Array, fill 통해서 16개 만들거임.
const tileCount = 16;

let tiles = [];

//3. 드래그
const dragged = {
    el: null,
    class: null,
    index: null,
};

let isPlaying = false;
let timeInterval = null;
let time = 0;

//console.log(tiles);
setGame();

//2. 퍼즐 랜덤
function setGame() {
    isPlaying = false;
    time = 0;
    container.innerHTML = '';
    gameText.style.display = 'none';
    clearInterval(timeInterval);
    
    tiles = createImageTiles();
    tiles.forEach(tile => container.appendChild(tile));
    
}

function createImageTiles() {
    //배열 16개 생성. 여기서 인덱스가 필요.
    //console.log(Array(16).fill());
    const tempArray = [];
    Array(tileCount).fill().forEach((_, i) => {
        //console.log(i);
        //li, data-index="i" 속성 생성
        const li = document.createElement("li");
        li.setAttribute("data-index", i);
        li.setAttribute('draggable', 'true');
        li.classList.add(`list${i}`);
        //console.log(li);
        //container.appendChild(li); //순서대로 출력됨
        tempArray.push(li);
    });
    return tempArray;
}

//2.카드 랜덤으로 섞기
function shuffle(array) {
    let index = array.length - 1;
    while (index > 0) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        //두개의 배열 원소 선택해 순서 섞기
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
        index--;
    }
    return array;
}

//5.드롭될 때마다 상태 체크 
function checkStatus(){
    const currentList = [...container.children]; //container의 children을 배열 형태로 만들기.
    //filter() 제시하는 조건에 만족하는 요소만 리턴시키는 것. 나머지는 버림.
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute('data-index')) !== index);
    //console.log(unMatchedList);

    //매치 안된 퍼즐이 없다면 게임종료
    if(unMatchedList.length === 0){
        gameText.style.display = 'block';
        isPlaying = false;
        clearInterval(timeInterval);
    }
}

//3.드래그 이벤트
container.addEventListener('dragstart', e => {
    //isPlaying이 false면 드래그이벤트 발생 X
    if(!isPlaying) return;
    //console.log(e); //드래그 씹힐 때가 있는데 위에 li에 draggable true 속성을 넣어줘야함.
    const obj = e.target;
    dragged.el = obj;
    dragged.class = obj.className;
    //console.log(typeof e.target.parentNode.childre);
    dragged.index = [...obj.parentNode.children].indexOf(obj);
});

//드래그를 한 채로 어디에 올라갔을 때
container.addEventListener('dragover', e => {
    //console.log('over'); //
    e.preventDefault();
});

//4.드래그를 놓았을 때
container.addEventListener('drop', e => {
    //isPlaying이 false면 드롭 x.
    if(!isPlaying) return;
    //console.log('dropped'); //드롭 발생이 안됨. 이는 어떤 요소 위에 오버된 상태로 놓았기 때문. so dragover에서 e.preventDefault() 걸어 이벤트 발생하지 않도록 해야함.
    const obj = e.target;

    if(obj.className !== dragged.class){
        let originPlace;
        let isLast = false;
    
        //드래그한 요소의 다음요소가 있으면 위치를 다음요소와 바꾸기
        if(dragged.el.nextSibling){
            originPlace = dragged.el.nextSibling;
        } else {
            //없으면 이전과 바꾸기
            originPlace = dragged.el.previousSibling;
            isLast = true;
        }
        /* obj.before(dragged.el); */ //드래그 했을 때, 있던 퍼즐이 뒤로 밀려나는 현상.
        const droppedIndex = [...obj.parentNode.children].indexOf(obj);
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
        isLast ? originPlace.after(obj) : originPlace.before(obj);
    }
    checkStatus();

});

//6. start 버튼 클릭 시 시작
startButton.addEventListener('click', () => {
    setGame();
    time = 0;
    playTime.innerText = time;
    container.innerHTML = '';
    gameText.style.display = 'none';
    runGame();
});

function runGame() {
    isPlaying = true;
    container.innerHTML = '';
        shuffle(tiles).forEach(tile => container.appendChild(tile));
        timeInterval = setInterval(() => {
            playTime.innerText = time;
            time++;
    },1000);
    
}