import React, { useState, useEffect } from 'react';


// ======= 画像指定
let imageSrc = '20240616_014534_p4a_v20_.webp';
// const imageSrc = '20240629_144258_himaXLv6_.webp';

// パズル全体のアスペクト比（背景はこれに合わせて広がる）
let ASPECT_RATIO:number=1.0

// パズルの分割数
let ROWS = 4
let COLS = 4

// window scopeで設定上書きテスト
const winScope = (window as any)
if(winScope.SlidePuzzleConfig){
	const conf = winScope.SlidePuzzleConfig;
	if(conf.src){
		imageSrc = conf.src;
		// console.warn(`imageSrc をconfで上書きしました。${conf.src}`);
	}
	if(conf.ratio){
		ASPECT_RATIO = conf.ratio;
		// console.warn(`ASPECT_RATIO をconfで上書きしました。${conf.ratio}`);
	}
	if(conf.rows){
		ROWS = conf.rows;
		// console.warn(`ROWS をconfで上書きしました。${conf.rows}`);
	}
	if(conf.cols){
		COLS = conf.cols;
		// console.warn(`COLS をconfで上書きしました。${conf.cols}`);
	}
}
// else
// {
// 	console.warn(`SlidePuzzleConfig は未定義でした。`);
// }

// URLハッシュ渡しでパズルパラメーターを上書きする
// url例: http://localhost:3000/#src=123.png&ratio=1.333&cols=3&rows=4
// - http://localhost:3000/#src=20240616_014534_p4a_v20_.webp&ratio=1.333&cols=3&rows=4
// - http://localhost:3000/#src=20240629_144258_himaXLv6_.webp&ratio=1.333&cols=3&rows=4
const hash = window.location.hash.substring(1); 
const params = hash.split('&');
interface ParamsObject {
    [key: string]: string;
}
const paramsObject: ParamsObject = {};
params.forEach(param => {
    const [key, value] = param.split('=');
    paramsObject[key] = decodeURIComponent(value);
});

if(paramsObject['src']){
	imageSrc = paramsObject['src'];
	// console.warn(`imageSrc をhashで上書きしました。:${paramsObject['src']}`);
}
if(paramsObject['ratio']){
	ASPECT_RATIO = (paramsObject['ratio'] as unknown as number);
	// console.warn(`ASPECT_RATIO をhashで上書きしました`);
}
if(paramsObject['cols']){
	COLS = (paramsObject['cols'] as unknown as number);
	// console.warn(`COLS をhashで上書きしました`);
}
if(paramsObject['rows']){
	ROWS = (paramsObject['rows'] as unknown as number);
	// console.warn(`ROWS をhashで上書きしました`);
}


// ===== 設定ここまで

const INDEX_MAX = ROWS * COLS

// i-mobileをreactに貼るハック
// https://takagi.blog/display-i-mobile-ads-on-gatsby/
const ImobileBannerAds = () => {
	useEffect(() => {
	  if (process.env.NODE_ENV !== "development") {
		const tag = document.createElement("script");
		tag.src = "https://imp-adedge.i-mobile.co.jp/script/v1/spot.js";
		tag.async = true;
		document.body.appendChild(tag);
  
		((window as any).adsbyimobile = (window as any).adsbyimobile || []).push(
		  {
			pid: 42660,
			mid: 570329,
			asid: 1853792,
			type: "banner",
			display: "block",
			elementid: "im-1"
		  }
		)
  
		document.body.removeChild(tag);
	  }
	}, [])
  
	return (
	  <div id="im-1"></div>
	)
}


const App = () => {

	const initialTiles = Array.from(Array(INDEX_MAX).keys());
	const [currentTiles, setTiles] = useState<number[]>(initialTiles);
	const [currentEmptyIndex, setEmptyIndex] = useState<number>((INDEX_MAX-1));

	useEffect(() => {
		shufflePanels(10);
	}, []);

	// 0...(max-1)の整数ランダムを取得
	const rnd = (max: number) => {
		const result = Math.floor(Math.random() * max);
		// console.log(`rnd: ${result}`);
		return result
	}

	const resetPanels = () => {
		setTiles(initialTiles);
		setEmptyIndex((INDEX_MAX-1));
	}

	const shufflePanels = (count: number) => {
		let newTiles = [...currentTiles];
		let emptyIndex = currentEmptyIndex;
		for (let i= 0; i < count ; i++){
			while(true){
				// ランダムに動かせるマスを探す
				const targetIndex = rnd(INDEX_MAX)
				if (!canMove(newTiles, targetIndex, emptyIndex)){
					continue;
				}
				// 動かす
				newTiles = move(newTiles, targetIndex, emptyIndex);
				emptyIndex = targetIndex;
				break;
			}
		}
		// 反映
		setTiles(newTiles);
		setEmptyIndex(emptyIndex);
	}

	const canMove = (tiles: number[], index: number, emptyIndex: number): boolean => {
		const row = Math.floor(index / COLS);
		const col = index % COLS;
		const emptyRow = Math.floor(emptyIndex / COLS);
		const emptyCol = emptyIndex % COLS;
		return (row === emptyRow && Math.abs(col - emptyCol) === 1) || (col === emptyCol && Math.abs(row - emptyRow) === 1);
	};

	const handleTileClick = (index: number) => {
		console.log(`handle click: ${index}`)
		if (canMove(currentTiles, index, currentEmptyIndex)) {
			const newTiles = move(currentTiles, index, currentEmptyIndex)
			// 反映
			setTiles(newTiles);
			setEmptyIndex(index);
		}
	};

	const move = (tiles: number[], index: number, emptyIndex: number) => {
		const newTiles = [...tiles];
		// console.log(`move: ${index} to ${emptyIndex}`);
		[newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
		return newTiles
	}

	return (
		<div className="container"
			style={{
			}}
		>
			<div id="im-1"><ImobileBannerAds /></div>

			<div className="puzzle"
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					position: 'relative',
					width: '100%',
					height: 'auto',
					aspectRatio: ASPECT_RATIO,
				}}
			>
				{currentTiles.map((tile, index) => (
					<div
						key={index}
						className="tile"
						style={{
							backgroundSize:`${100*COLS}% ${100*ROWS}%`,
							width: `${100/COLS}%`,
							height: `${100/ROWS}%`,
							backgroundImage: tile !== (INDEX_MAX-1) ? `url(${imageSrc})` : 'none',

							backgroundPosition: `${-(tile % COLS) * 100}% ${-Math.floor(tile / COLS) * 100}%`,

							transform: `translate(${(index % COLS) * 100}%, ${Math.floor(index / COLS) * 100}%)`,
						}}
						onClick={() => handleTileClick(index)}
					/>
				))}
			</div>
			<div>
				<span>
					<button onClick={()=>{resetPanels()}}>リセット(解答)</button>
					<button onClick={()=>{shufflePanels(10)}}>shuffle 10</button>
					<button onClick={()=>{shufflePanels(30)}}>shuffle 30</button>
					<button onClick={()=>{shufflePanels(100)}}>shuffle 100</button>
					<button onClick={()=>{shufflePanels(1000)}}>shuffle 1000</button>
				</span>
			</div>
		</div>
	);
};

export default App;
