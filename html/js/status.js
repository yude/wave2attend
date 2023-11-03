function updateStatus() {
    fetch("/api/status?idm=" + targetIdm + "&status=" + targetStatus)
        .then((res) => res.json())
        .then((data) => console.log(data))
}
