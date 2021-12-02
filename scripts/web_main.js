const apiHost = `<<REPLACE_API_HOST>>`;

const getNewState = async () => {
    const res = await fetch(`${apiHost}/link`, {
        method: 'GET',
    });

    const data = await res.json();

    document.querySelector('#newlink').setAttribute('style', 'display: none;');
    document.querySelector('#checkstate').setAttribute('style', 'display: block;');
    checkState();
    window.sessionStorage.setItem("state", data.state);
    window.open(data.link_url, '_blank').focus();
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