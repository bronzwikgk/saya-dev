class Loader {
    static showLoader() {
        document.querySelector('.loader-wrapper').style.display = 'flex';
    }
    
    static hideLoader() {
        document.querySelector('.loader-wrapper').style.display = 'none';
    }
    
}

export {Loader}