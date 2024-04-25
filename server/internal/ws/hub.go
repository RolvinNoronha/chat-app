package ws

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"`
}

type Hub struct {
	Room       map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan *Message
}

func NewHub() *Hub {
	return &Hub{
		Room:       make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan *Message, 5),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case cl := <-h.Register:
			// check if roomId exists
			_, ok := h.Room[cl.RoomID]
			if ok {

				r := h.Room[cl.RoomID]

				// check if client exists in this roomid
				_, ok := r.Clients[cl.ID]
				if !ok {
					r.Clients[cl.ID] = cl
				}
			}
		case cl := <-h.Unregister:
			// check if roomId exists
			_, ok := h.Room[cl.RoomID]
			if ok {
				// check if client exits in the room
				_, ok := h.Room[cl.RoomID].Clients[cl.ID]
				if ok {

					// if users exists in the room broadcast message that a user has left
					if len(h.Room[cl.RoomID].Clients) != 0 {
						h.Broadcast <- &Message{
							Content:  "User left the chat",
							RoomID:   cl.RoomID,
							Username: cl.Username,
						}
					}
					delete(h.Room[cl.RoomID].Clients, cl.ID)
					close(cl.Message)
				}
			}
		case m := <-h.Broadcast:
			// check if room exists
			_, ok := h.Room[m.RoomID]
			if ok {
				for _, cl := range h.Room[m.RoomID].Clients {
					cl.Message <- m
				}
			}
		}
	}
}
