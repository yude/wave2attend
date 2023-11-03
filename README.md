# wave2attend

Recording your attendance using a NFC card via WebUSB.

## Use

* Run `docker compose up -d` to execute this application.
* HTTPS is required to use this application (for WebUSB)
  * or run its client & server on the same machine and access via `localhost`.
* Tested on following environments (as a client):
  * Google Chrome 119.0.6045.105, macOS 14.1, SONY RC-S320


## Acknowledgements

This project heavily relies on [muojp](https://github.com/muojp)'s [webpasori](https://github.com/muojp/webpasori).

## License

GNU General Public License 2.0
