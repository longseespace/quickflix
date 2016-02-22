import styles from './VideoPlaylistUI.scss'
const videojs = window.videojs
const Button = videojs.getComponent('Button')

class VideoPlaylistMenu extends Button {
  constructor (player, options) {
    super(player, options)
    this.currentEpisode = options.currentEpisode || 1
    this.items = options.items || []
  }

  buildCSSClass () {
    return `vjs-icon-chapters ${super.buildCSSClass()}`
  }
}
VideoPlaylistMenu.prototype.controlText_ = 'Playlist'
videojs.registerComponent('VideoPlaylistMenu', VideoPlaylistMenu)

class VideoPrevButton extends Button {
  constructor (player, options) {
    super(player, options)
    this._disabled = options.disabled
    if (this._disabled) {
      this.addClass(styles.disabled)
    }
  }

  buildCSSClass () {
    return `material-icons ${styles.iconPrev} ${super.buildCSSClass()}`
  }

  disabled = (val) => {
    if (val === undefined) {
      return this._disabled
    } else {
      this._disabled = val
      if (this._disabled) {
        this.addClass(styles.disabled)
      } else {
        this.removeClass(styles.disabled)
      }
    }
  }
}
VideoPrevButton.prototype.controlText_ = 'Previous'
videojs.registerComponent('VideoPrevButton', VideoPrevButton)

class VideoNextButton extends Button {
  constructor (player, options) {
    super(player, options)
    this._disabled = options.disabled
    if (this._disabled) {
      this.addClass(styles.disabled)
    }
  }

  disabled = (val) => {
    if (val === undefined) {
      return this._disabled
    } else {
      this._disabled = val
      if (this._disabled) {
        this.addClass(styles.disabled)
      } else {
        this.removeClass(styles.disabled)
      }
    }
  }

  buildCSSClass () {
    return `material-icons ${styles.iconNext} ${super.buildCSSClass()}`
  }
}
VideoNextButton.prototype.controlText_ = 'Next'
videojs.registerComponent('VideoNextButton', VideoNextButton)

const PlaylistUI = function (options) {
  const { currentEpisode, items, play, action = 'init' } = options
  if (action === 'init') {
    if (currentEpisode !== undefined && items && items.length > 0 && play) {
      this.currentEpisode = +currentEpisode
      this.items = items

      this.playlistMenu = this.controlBar.addChild('VideoPlaylistMenu', options)
      this.controlBar.el().insertBefore(this.playlistMenu.el(), this.controlBar.fullscreenToggle.el())

      const prevButtonOptions = {
        disabled: currentEpisode === 1
      }
      this.prevButton = this.controlBar.addChild('VideoPrevButton', prevButtonOptions)
      this.controlBar.el().insertBefore(this.prevButton.el(), this.controlBar.playToggle.el())
      this.prevButton.on('click', () => {
        if (!this.prevButton.disabled()) {
          play(this.currentEpisode - 1)
        }
      })

      const nextButtonOptions = {
        disabled: currentEpisode === items.length
      }
      this.nextButton = this.controlBar.addChild('VideoNextButton', nextButtonOptions)
      this.controlBar.el().insertBefore(this.nextButton.el(), this.controlBar.volumeMenuButton.el())
      this.nextButton.on('click', () => {
        if (!this.nextButton.disabled()) {
          play(this.currentEpisode + 1)
        }
      })
    }
  } else {
    if (currentEpisode !== undefined) {
      this.currentEpisode = +currentEpisode
      if (this.currentEpisode === 1) {
        this.prevButton.disabled(true)
      } else {
        this.prevButton.disabled(false)
      }

      if (this.currentEpisode === this.items.length) {
        this.nextButton.disabled(true)
      } else {
        this.nextButton.disabled(false)
      }
    }
  }
}

videojs.plugin('PlaylistUI', PlaylistUI)
