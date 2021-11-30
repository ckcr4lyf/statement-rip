const getNewState = async () => {
    const res = await fetch('http://localhost:3000/link', {
        method: 'GET',
    });

    const data = await res.json();

    window.sessionStorage.setItem("state", data.state);
    window.open(data.link_url, '_blank').focus();
    return data;
}

const checkState = async () => {
    const state = window.sessionStorage.getItem("state");
    const queryUrl = 'http://localhost:3000/status/' + state;
    console.log(queryUrl);
    const res = await fetch(queryUrl, {
        method: 'GET',
    });

    const data = await res.json();

    document.querySelector('#status').innerHTML = data.status;
    return data;
}