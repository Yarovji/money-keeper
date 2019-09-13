export class AuthService {

    private isAuthentificated = false;

    login () {
        this.isAuthentificated = true;
    }

    logout () {
        this.isAuthentificated = false;
        window.localStorage.clear();
    }

    isLoggedIn (): boolean {
        return this.isAuthentificated;
    }

}
