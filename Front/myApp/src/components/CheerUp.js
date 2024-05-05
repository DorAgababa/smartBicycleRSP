import { SetAlert } from '../App';
import { Sleep } from '../utils';
import { State } from './Alert';

async function CheerUp (message, song, isMuted = false) {
    await Sleep(2)
    if (!isMuted) {
        let audio = new Audio(song);
        audio.play();
    }
    SetAlert(message, "", State.success);
};

export default CheerUp;