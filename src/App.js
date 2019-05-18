import React, { Component } from 'react';
import ReactHowler from 'react-howler';
import raf from 'raf';

class App extends Component {
  constructor(props) {
    super(props)

    // this.onLoad = this.onLoad.bind(this)
    // this.onPlay = this.onPlay.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.handlePause = this.handlePause.bind(this)
    this.renderSeekPos = this.renderSeekPos.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.clearRAF = this.clearRAF.bind(this)

    this.state = {
      playing: false,
      isAller: true,
    }
  }

  // onLoad(args) {
  //   console.log('onLoad - args', args)
  // }

  // onPlay(args) {
  //   console.log('onPlay - args', args);
  //   console.log('onPlay - duration', this.player.duration());
  //   console.log('onPlay - seek', this.player.seek());
  // }

  // onPlayAller() {
  //   const position = this.playerAller.seek();
  //   this.playerAller.seek(this.playerAller.duration() - position);
  // }

  handlePlay () {
    const { playing, isAller } = this.state
    const newState = {};

    if (playing) {
      newState.isAller = !isAller;
      const position = isAller ? this.playerAller.seek() : this.playerRetour.seek();
      const nextPlayer = isAller ? this.playerRetour : this.playerAller;
      nextPlayer.seek(nextPlayer.duration() - position);
    }
    else {
      newState.playing = true;
    }
    
    this.setState(newState);
  }

  handlePause () {
    this.setState({
      playing: false
    })
    this.clearRAF();
  }

  // onPlayRetour() {
  //   const position = this.playerAller.seek();
  //   this.playerRetour.seek(this.playerRetour.duration() - position);
  // }

  renderSeekPos () {
    const { isAller, playing } = this.state;
    const player = isAller ? this.playerAller : this.playerRetour;

    this.setState({
      seek: player.seek()
    })
    if (playing) {
      this._raf = raf(this.renderSeekPos)
    }
  }

  onEnd(args) {
    this.setState({playing: false});
    this.clearRAF();
  }

  clearRAF () {
    raf.cancel(this._raf)
  }

  componentWillUnmount() {
    this.clearRAF()
  }

  render() {
    const { playing, isAller, seek } = this.state

    return (
      <div>
        <div>
          <ReactHowler
            src={['/assets/aller.mp3','/assets/retour.mp3']}
            preload
            playing={playing && isAller}
            loop={false}
            ref={(ref) => (this.playerAller = ref)}
            onPlay={this.renderSeekPos}
            onEnd={this.onEnd}
          />
        </div>
        <p>
          {isAller ? 'Aller' : 'Retour'} : {seek ? seek.toFixed(2) : '0.00'}
        </p>
        {playing && <button onClick={this.handlePlay}>{ isAller ? 'Piste "Retour"' : 'Piste "Aller"' }</button>}
        {!playing && <button onClick={this.handlePlay}>{ 'Lecture' }</button>}
        <button onClick={this.handlePause}>Pause</button>
        <div>
          <ReactHowler
            src='/assets/retour.mp3'
            preload
            playing={playing && !isAller}
            loop={false}
            ref={(ref) => (this.playerRetour = ref)}
            onPlay={this.renderSeekPos}
            onEnd={this.onEnd}
          />
        </div>
      </div>
    );
  }
}

export default App;
