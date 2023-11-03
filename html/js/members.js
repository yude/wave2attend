function getMembers() {
    const url = "/api/members";
    const memberArea = document.getElementById("members");

    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data.result)
        data.result.forEach((member) => {
        const tr = document.createElement("tr");
        tr.classList.add("border-b");
        memberArea.appendChild(tr);

        const objArray = Object.entries(member);
        objArray.forEach((arr, idx) => {
            if (idx != 0) {
            const td = document.createElement("td");
            td.classList.add("px-6");
            td.classList.add("py-4");

            if (idx == 2) {
                if (arr[1] === "in") {
                td.textContent = "在席"
                } else if (arr[1] === "out") {
                td.textContent = "外出"
                } else {
                td.textContent = "N/A";
                }
            } else {
                td.textContent = arr[1]
            }
            tr.appendChild(td);
            }
        })
        })
    })
}
