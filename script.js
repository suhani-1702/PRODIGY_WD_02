class Stopwatch {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.pausedTime = 0;
        this.laps = [];
        this.animationId = null;

        this.initElements();
        this.attachEventListeners();
    }

    initElements() {
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.lapsList = document.getElementById('lapsList');

        this.minutesDisplay = document.querySelector('.time-minutes');
        this.secondsDisplay = document.querySelector('.time-seconds');
        this.millisecondsDisplay = document.querySelector('.time-milliseconds');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.pausedTime;

            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;

            this.animate();
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.pausedTime = Date.now() - this.startTime;

            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;

            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    }

    reset() {
        this.isRunning = false;
        this.startTime = 0;
        this.pausedTime = 0;
        this.laps = [];

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.updateDisplay(0);
        this.renderLaps();
    }

    recordLap() {
        if (this.isRunning) {
            const lapTime = this.pausedTime + (Date.now() - this.startTime);
            this.laps.push(lapTime);
            this.renderLaps();
        }
    }

    animate() {
        const currentTime = this.pausedTime + (Date.now() - this.startTime);
        this.updateDisplay(currentTime);

        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    updateDisplay(time) {
        const totalMilliseconds = Math.floor(time);
        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

        this.minutesDisplay.textContent = this.pad(minutes);
        this.secondsDisplay.textContent = this.pad(seconds);
        this.millisecondsDisplay.textContent = this.pad(milliseconds);
    }

    pad(num) {
        return String(num).padStart(2, '0');
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        return `${this.pad(minutes)}:${this.pad(seconds)}.${this.pad(ms)}`;
    }

    renderLaps() {
        if (this.laps.length === 0) {
            this.lapsList.innerHTML = '<p class="empty-state">No laps recorded yet</p>';
            return;
        }

        let lapTimes = [];
        for (let i = 0; i < this.laps.length; i++) {
            let lapTime;
            if (i === 0) {
                lapTime = this.laps[i];
            } else {
                lapTime = this.laps[i] - this.laps[i - 1];
            }
            lapTimes.push({ number: i + 1, time: lapTime, totalTime: this.laps[i] });
        }

        // Find fastest and slowest laps
        const fastest = Math.min(...lapTimes.map(lap => lap.time));
        const slowest = Math.max(...lapTimes.map(lap => lap.time));

        this.lapsList.innerHTML = lapTimes
            .map((lap, index) => {
                let className = 'lap-item';
                if (lap.time === fastest && this.laps.length > 1) className += ' fastest';
                if (lap.time === slowest && this.laps.length > 1) className += ' slowest';

                return `
                    <div class="${className}">
                        <span class="lap-number">Lap ${lap.number}</span>
                        <span class="lap-time">${this.formatTime(lap.time)}</span>
                    </div>
                `;
            })
            .reverse()
            .join('');

        // Scroll to bottom
        this.lapsList.scrollTop = this.lapsList.scrollHeight;
    }
}

// Initialize stopwatch when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
});
