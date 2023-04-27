## Web Socket
- It is especially great for services that require ***continuous*** data exchange, e.g. online games, ***real-time*** trading systems and so on.
- Once the socket is created, we should listen to events on it. There are totally 4 events:
	-   **`open`** – connection established,
	-   **`message`** – data received,
	-   **`error`** – websocket error,
	-   **`close`** – connection closed.
- The events flow:  `open` → `message` → `close`