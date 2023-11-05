var loaded = false;
var usbReady = false;

let targetIdm = "";
let targetStatus = "";

async function useReader() {
    try {
        await navigator.usb.requestDevice({ filters: [{ vendorId: 0x054c }] })
    } catch {
        var element = document.getElementById('output');
        element.value += "No available NFC reader found."
    }
    usbReady = true;
}

function invokeMain() {
    if (usbReady) {
        Module._main();
    } else {
        var element = document.getElementById('output');
        element.value += "NFC card reader is not ready.\n"

        alertBox = document.getElementById("warning-alert");
        console.log("aaa")
        alertBoxBody = document.getElementById("warning-alert-body");
        alertBoxBody.innerHTML = "カードリーダーがまだ接続されていません。"
        alertBox.classList.remove("hidden");
        let after = () => alertBox.classList.add("hidden");
        window.setTimeout(after, 1500)
    }
}

var Module = {
    preRun: (function () {
    loaded = false;
    }),
    postRun: (function () {
    loaded = false;
    
    }),
    print: (function () {
    var element = document.getElementById('output');
    if (element) element.value = ''; // clear browser cache
    return function (text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        // These replacements are necessary if you render to raw HTML
        //text = text.replace(/&/g, "&amp;");
        //text = text.replace(/</g, "&lt;");
        //text = text.replace(/>/g, "&gt;");
        //text = text.replace('\n', '<br>', 'g');
    //   console.log(text);

        if (element) {
            element.value += text + "\n";
            element.scrollTop = element.scrollHeight; // focus on bottom
        }

        // Get IDm
        if (typeof text === "string") {
            if (text.match(/^(?=.*card IDm).*$/)) {
                if (!loaded) {
                    targetIdm = text.replace("# card IDm = ", "")
                    console.log(targetIdm)
                    document.getElementById("idm").innerHTML = "カードの IDm: " + targetIdm;
                    loaded = true;
                    updateStatus();

                    alertBox = document.getElementById("success-alert");
                    alertBoxBody = document.getElementById("success-alert-body");
                    alertBoxBody.innerHTML = "更新しました。"
                    alertBox.classList.remove("hidden");
                    let after = () => {alertBox.classList.add("hidden"); getMembers();}
                    window.setTimeout(after, 1500)
                }
            }
        } else {
            element.value += "Nothing was returned from the reader.";
            alertBox = document.getElementById("warning-alert");
            alertBoxBody = document.getElementById("warning-alert-body");
            alertBoxBody.innerHTML = "カードリーダーから何もデータが返されませんでした。ページを更新して、カードリーダーを接続し直してください。"
            alertBox.classList.remove("hidden");
            alertBox.classList.remove("hidden");
            let after = () => alertBox.classList.add("hidden");
            window.setTimeout(after, 1500)
        }
    }
    })(),
    printErr: function (text) {
    if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
    if (0) { // XXX disabled for safety typeof dump == 'function') {
        dump(text + '\n'); // fast, straight to the real console
    } else {
        console.error(text);
    }
    },
    setStatus: function (text) {
    if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
    if (text === Module.setStatus.text) return;
    var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
    var now = Date.now();
    if (m && now - Date.now() < 30) return; // if this is a progress update, skip it if too soon
    if (m) {
        text = m[1];
    }
    },
    totalDependencies: 0,
    monitorRunDependencies: function (left) {
    this.totalDependencies = Math.max(this.totalDependencies, left);
    Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    },
    noInitialRun: true
};
Module.setStatus('Downloading...');
window.onerror = function (event) {
    // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
    Module.setStatus('Exception thrown, see JavaScript console');
    Module.setStatus = function (text) {
    if (text) Module.printErr('[post-exception status] ' + text);
    };
};
