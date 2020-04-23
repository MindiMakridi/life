import Event from './Event';

interface Observer {
    notify(event: Event): void
}

export default Observer;