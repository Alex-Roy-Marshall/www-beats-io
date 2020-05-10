import React,{useState, useEffect} from 'react';
import useBufferLoader from "./hooks/use-buffer-loader";

function App() {

	const[context, setContext] = useState(new AudioContext());
	const[channels, setChannels] = useState([]);
	const[loadFiles, {files, loadingError}] = useBufferLoader();
	const[error, setError] = useState('');
	const[isPlaying, setIsPlaying] = useState(false);
	const[bpm, setBpm] = useState(120);
	const[activeBeat, setActiveBeat] = useState(0);
	const[nextBeatTime, setNextBeatTime] = useState(null);

	useEffect( () => {
		if(context!==null){
			loadFiles(context, {
				bass: "./audio/bass-drum.wav",
				crash: "./audio/crash.wav",
				tomHigh: "./audio/high-tom.wav",
				tomMedium: "./audio/medium-tom.wav",
				tomLow: "./audio/low-tom.wav",
				hiHat: "./audio/hihat.wav",
				kick: "./audio/kick.wav",
				snare: "./audio/snare.wav",
			})
		}
	},[context]);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveBeat( activeBeat => activeBeat===12 ? 1 : activeBeat + 1)
		}, 500);
		return () => clearInterval(interval);
	}, []);

	useEffect(()=>{
		//line up all needed sounds for next beat
		let k = (activeBeat-1);
		channels.map((channel)=>{
			if(channel.beats[k]){
				schedulePlayback(channel.name, k);
			}
		})
	},[activeBeat]);

	useEffect(()=>{
		if(loadingError!==null){
			setError(loadingError);
		}
	},[loadingError]);

	useEffect(()=>{
		if(files!==null){
			let channels = [];
			console.log({files});
			for(const prop in files){
				channels.push({
					name: prop,
					beats: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				})
			}
			setChannels(channels);
		}
	}, [files]);

	const toggle = (channel, beat) => {
		let newChannels = [...channels];
		newChannels[channel].beats[beat] = !newChannels[channel].beats[beat]
		setChannels(newChannels)
	}

	const schedulePlayback = (src, beatIndex) => {
		console.log({src, beatIndex});
		let node = context.createBufferSource();
		node.buffer = files[src];
		node.connect(context.destination);
		node.start(0);
	}

	const play = (key) => {
		let node = context.createBufferSource();
		node.buffer = files[key];
		node.connect(context.destination);
		node.start(0);
	}

	return (
		<div className="container">
			{error ? (
				<div className="alert alert-danger" role="alert">
					{error}
				</div>
			) : null}

			<div className="row">
				<button onClick={()=>setIsPlaying(!isPlaying)} className="btn btn-primary">Play</button>
				<div className="form-group">
					<select className="form-control" defaultValue={bpm} onChange={e => setBpm(e.target.value)}>
						<option value={120}>120</option>
						<option value={160}>160</option>
						<option value={200}>200</option>
					</select>
				</div>
			</div>

			<div className="row">
				<div className="col-2">
					<p>Active beat: {activeBeat}</p>
				</div>
				<div className="col-10">
					<div className="row">
						<div className={activeBeat===1 ? "col-1 bg-danger" : "col-1"}>1</div>
						<div className={activeBeat===2 ? "col-1 bg-danger" : "col-1"}>2</div>
						<div className={activeBeat===3 ? "col-1 bg-danger" : "col-1"}>3</div>
						<div className={activeBeat===4 ? "col-1 bg-danger" : "col-1"}>4</div>
						<div className={activeBeat===5 ? "col-1 bg-danger" : "col-1"}>5</div>
						<div className={activeBeat===6 ? "col-1 bg-danger" : "col-1"}>6</div>
						<div className={activeBeat===7 ? "col-1 bg-danger" : "col-1"}>7</div>
						<div className={activeBeat===8 ? "col-1 bg-danger" : "col-1"}>8</div>
						<div className={activeBeat===9 ? "col-1 bg-danger" : "col-1"}>9</div>
						<div className={activeBeat===10 ? "col-1 bg-danger" : "col-1"}>10</div>
						<div className={activeBeat===11 ? "col-1 bg-danger" : "col-1"}>11</div>
						<div className={activeBeat===12 ? "col-1 bg-danger" : "col-1"}>12</div>
					</div>
				</div>
			</div>

			{channels.map( (channel, cIndex) => (
				<div key={`channel-${cIndex}`}className="row">
					<div className="col-2">
						<p><button className="btn btn-outline-info" onClick={()=>play(channel.name)}>{channel.name}</button></p>
					</div>
					<div className="col-10">
						<div className="row">
							{channel.beats.map( (beat, bIndex ) => (
								<div key={`beat-${bIndex}`} className="col-1">
									<button onClick={()=>toggle(cIndex, bIndex)} className={beat ? "btn btn-primary" : "btn btn-outline-primary"}>&nbsp;</button>
								</div>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default App;
