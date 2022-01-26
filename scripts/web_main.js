const apiHost = `<<REPLACE_API_HOST>>`;

const getNewState = async () => {
    const res = await fetch(`${apiHost}/link`, {
        method: 'GET',
    });

    const data = await res.json();
    window.location = data.link_url;
    return data;
}

const checkState = async () => {
    const state = window.sessionStorage.getItem("state");
    const queryUrl = `${apiHost}/status/` + state;
    console.log(queryUrl);
    const res = await fetch(queryUrl, {
        method: 'GET',
    });

    const data = await res.json();

    document.querySelector('#status').innerHTML = data.status;

    if (data.status === 'SUCCESS'){
        document.querySelector('#downloadclick').setAttribute('href', `${apiHost}/download/` + state)
        document.querySelector('#downloaddiv').setAttribute('style', 'display: block;');
    }

    return data;
}

const checkHash = () => {

    const hashVal = location.hash;
    console.log(hashVal);

    // The '#' + 26 char ULID (state)
    if (hashVal.length !== 27) {
        document.querySelector('#newlink').setAttribute('style', 'display: block;');
        document.querySelector('#checkstate').setAttribute('style', 'display: none;');
        return;
    }

    // Otherwise they have linked! This is the callback
    const state = hashVal.substring(1);
    window.sessionStorage.setItem("state", state);
    
    document.querySelector('#newlink').setAttribute('style', 'display: none;');
    document.querySelector('#checkstate').setAttribute('style', 'display: block;');
    checkState();
}

