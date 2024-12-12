const puzzleBoard = document.getElementById('puzzle-board');
const imageModeButton = document.getElementById('image-mode-button');
const cameraModeButton = document.getElementById('camera-mode-button');
const takePhotoButton = document.getElementById('take-photo-button');
const camera = document.getElementById('camera');
const cameraContainer = document.getElementById('camera-container');

const fullscreenDiv = document.getElementById('image-fullscreen');
const photoCanvas = document.getElementById('photo-canvas');
const imageButtons = [
    document.getElementById('image1-button'),
    document.getElementById('image2-button'),
    document.getElementById('image3-button'),
    document.getElementById('image4-button'),
    document.getElementById('image5-button'),
];

let imageUrl = 'image1.jpg';

// 랜덤 다각형 생성
function generateRandomPolygon() {
    const points = [];
    const numPoints = Math.floor(Math.random() * 2) + 3; // 꼭짓점
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 150;
        const y = Math.random() * 150;
        points.push(`${x}% ${y}%`);
    }
    return `polygon(${points.join(", ")})`;
}

// 퍼즐 조각 생성
function createPuzzle(numPieces = 10) {
    if (!imageUrl) {
        alert("이미지를 먼저 선택하세요.");
        return;
    }
    puzzleBoard.innerHTML = ''; // 기존 퍼즐 초기화
    for (let i = 0; i < numPieces; i++) {
        const piece = document.createElement('div');
        piece.classList.add('piece');

        const randomClip = generateRandomPolygon();
        const randomWidth = Math.floor(Math.random() * 150) + 250;
        const randomHeight = Math.floor(Math.random() * 100) + 100;
        piece.style.clipPath = randomClip;
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundSize = '400px 400px';
        piece.style.width = `${randomWidth}px`;
        piece.style.height = `${randomHeight}px`;
        piece.style.left = `${Math.random() * (window.innerWidth - randomWidth)}px`;
        piece.style.top = `${Math.random() * (window.innerHeight - randomHeight)}px`;

        piece.addEventListener('mousedown', handleDragStart);
        document.body.appendChild(piece);
    }
}

// 드래그 이벤트 핸들러
function handleDragStart(event) {
    const draggedPiece = event.target;

    const handleMouseMove = (e) => {
        draggedPiece.style.left = `${e.pageX - draggedPiece.offsetWidth / 2}px`;
        draggedPiece.style.top = `${e.pageY - draggedPiece.offsetHeight / 2}px`;
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

imageButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        // 선택된 이미지의 URL 설정
        imageUrl = `./image${index + 1}.jpg`;
        console.log(`Button clicked, imageUrl: ${imageUrl}`);

        // 이미지 전체 화면 표시
        fullscreenDiv.style.backgroundImage = `url(${imageUrl})`;
        fullscreenDiv.classList.add('show');
        fullscreenDiv.style.display = 'block'; // display를 명시적으로 설정

        // 0.5초 후에 사라지게 설정
        setTimeout(() => {
            fullscreenDiv.classList.remove('show');
            fullscreenDiv.style.display = 'none'; // display를 다시 none으로
            console.log('Fullscreen div hidden');
        }, 500);
    });
});



// "조각 추가" 버튼 클릭 시 퍼즐 조각 생성
imageModeButton.addEventListener('click', () => {
    createPuzzle();
});



let autoAddPiecesInterval;

function getRandomImageUrl() {
    const randomIndex = Math.floor(Math.random() * 5); // 0~4 중 랜덤 선택
    return `./image${randomIndex + 1}.jpg`; // 랜덤 이미지 URL 반환
}

/*// 이미지 조각 자동 추가 함수
function startAutoAddPieces() {
    // 이전에 설정된 타이머가 있으면 제거
    if (autoAddPiecesInterval) {
        clearInterval(autoAddPiecesInterval);
    }

    autoAddPiecesInterval = setInterval(() => {
        const randomImageUrl = getRandomImageUrl();
        imageUrl = randomImageUrl; // 랜덤 이미지 설정
        createPuzzle(2); // 한 번에 하나의 조각 추가
    }, 5000);
}*/



// 페이지 로드 시 자동 추가 시작
document.addEventListener('DOMContentLoaded', () => {
    startAutoAddPieces();
});




// 카메라 모드 활성화
cameraModeButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camera.srcObject = stream;
        camera.style.display = 'block';
        cameraContainer.style.display = 'block';
        camera.style.filter = 'contrast(200%) saturate(300%) hue-rotate(180deg) brightness(80%)';
    } catch (error) {
        alert('카메라를 사용할 수 없습니다.');
    }
});

// 사진 촬영
takePhotoButton.addEventListener('click', () => {
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = camera.videoWidth;
    photoCanvas.height = camera.videoHeight;

    context.filter = camera.style.filter;
    context.drawImage(camera, 0, 0, photoCanvas.width, photoCanvas.height);
    imageUrl = photoCanvas.toDataURL('image/png');

    // 카메라 종료
    const stream = camera.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    camera.srcObject = null;

    camera.style.display = 'none';
    cameraContainer.style.display = 'none';

    createPuzzle();
});




// 마우스 움직임에 따라 h1 스타일 변경
const dynamicHeading = document.getElementById('dynamic-heading');
document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const windowWidth = window.innerWidth;

    const fontWeight = Math.min(Math.max(300 + (mouseX / windowWidth) * 400, 300), 600);
    const letterSpacing = Math.min(Math.max((mouseX / windowWidth) * 10, 0), 10);

    dynamicHeading.style.fontWeight = fontWeight;
    dynamicHeading.style.letterSpacing = `${letterSpacing}px`;
});





let puzzlePieceCount = 0; // 현재 퍼즐 조각 개수 추적

function createPuzzle(numPieces = 10) {
    if (!imageUrl) {
        alert("이미지를 먼저 선택하세요.");
        return;
    }

    for (let i = 0; i < numPieces; i++) {
        const piece = document.createElement('div');
        piece.classList.add('piece');

        const randomClip = generateRandomPolygon();
        const randomWidth = Math.floor(Math.random() * 150) + 250;
        const randomHeight = Math.floor(Math.random() * 100) + 100;
        piece.style.clipPath = randomClip;
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundSize = '400px 400px';
        piece.style.width = `${randomWidth}px`;
        piece.style.height = `${randomHeight}px`;
        piece.style.left = `${Math.random() * (window.innerWidth - randomWidth)}px`;
        piece.style.top = `${Math.random() * (window.innerHeight - randomHeight)}px`;

        piece.addEventListener('mousedown', handleDragStart);
        document.body.appendChild(piece);

        // 조각 개수 증가 및 체크
        puzzlePieceCount++;
        checkPuzzlePieceCount();
    }
}

function checkPuzzlePieceCount() {
    if (puzzlePieceCount >= 60) {
        showPopup();
    }
}

function showPopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.style.display = 'flex';
}

function closePopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.style.display = 'none';

    // 팝업 후 조각 초기화 (선택사항)
    puzzlePieceCount = 0; // 조각 개수 리셋
    document.querySelectorAll('.piece').forEach((piece) => piece.remove());
}

document.getElementById('popup-close-button').addEventListener('click', () => {
        location.reload();
    });


let bgSizePercentage = 100; // 배경 크기 초기값
const bgColors = [
    'rgba(255, 0, 0, 0.5)', 
    'rgba(0, 255, 0, 0.5)', 
    'rgba(0, 0, 255, 0.5)', 
    'rgba(255, 255, 0, 0.5)', 
    'rgba(255, 0, 255, 0.5)'
];
let colorIndex = 0;
let prevNoseX = null; // 이전 코 좌표 저장

// 섬광 효과 함수
function triggerFlashEffect() {
    document.body.style.backgroundColor = bgColors[colorIndex];
    colorIndex = (colorIndex + 1) % bgColors.length;
}

// Mediapipe FaceMesh 초기화
const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.9, // 민감도 증가
    minTrackingConfidence: 0.9, // 민감도 증가
});

const videoElement = camera; // 기존 카메라 스트림 재사용
const cameraFeed = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({ image: videoElement });
    },
    width: 640,
    height: 480,
});
cameraFeed.start();

// 얼굴 감지 결과 처리
faceMesh.onResults((results) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const face = results.multiFaceLandmarks[0];
        const noseX = face[4].x; // 코 중심부 X 좌표 (4번 랜드마크)

        if (prevNoseX !== null) {
            // 코의 X 좌표 변화량 계산
            const noseMovement = Math.abs(noseX - prevNoseX);

            if (noseMovement > 0.02) { // 민감도 임계값: 0.05
                bgSizePercentage += 10; // 배경 크기 증가
                document.body.style.backgroundSize = `${bgSizePercentage}% ${bgSizePercentage}%`;

                // 섬광 효과 트리거
                for (let i = 0; i < 5; i++) {
                    setTimeout(triggerFlashEffect, i * 500);
                }
            }
        }

        prevNoseX = noseX; // 현재 코 X 좌표 저장
    }
});





