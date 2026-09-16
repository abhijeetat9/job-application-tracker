import {atom} from 'recoil';

export const authAtom = atom({
    key: 'authAtom',
    default: {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user')) || null,
    }
})

