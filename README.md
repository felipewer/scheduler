# Scheduler Dapp

An Ethereum Smart Contract enabled widget for interview scheduling.

This project has an intentionally small feature scope and in fact is not the greatest blockchain use case candidate. It is more of an exercise to understand technologies and techniques used to integrate web stacks and smart contracts. In other words, how to develop Ethereum Dapps.

The widget is used in my [personal website](https://www.secbit.com.br). It is only rendered if the browser has web3 support (e.g. through Metamask extension). The smart contract [is deployed](0x4ac7a94bcec986d7435af94fd171681d818ef10cc2812a0089c5557604497a89) on the Ropsten testnet.

## Architecture

```
                             +------------------------------------+                                    
                             |             Website (Github Pages) |                                    
                             |                                    |                                    
                             |  +---------------------+           |                                    
                             |  |   Scheduler Widget  | -------------------------------------+         
                             |  +---------------------+           |                          |         
                             |      |                             |                          |         
                             |      v                             |                          |         
                             |  +---------+                       |                          |         
                             |  |  web3   |                       |                          |         
                             +--|---------|-----------------------+                          |         
       +------------------------|         |                       |                          |         
       |                     |  +---------+   Provider (Metamask) |                          |         
       |                     |                                    |                          |         
       |                     +------------------------------------+                          |         
       |                                                                                     |         
       |                                                                                     |         
       |                                                                                     |         
       |                                                                                     |         
       |                  +--------------------------------------------+                     |         
       |                  |                            VM (Amazon EC2) |                     |         
       v                  | +------------------------------------+     |                     v         
+-------------+           | |                             Docker |     |            +-----------------+
|             |           | |   +--------------------------+     |     |            |                 |
| Infura API  | <-------------> |    Scheduler Listener    | ----|-----|----------> | Google Calendar |
|             |           | |   +--------------------------+     |     |            |      API        |
+-------------+           | +------------------------------------+     |            +-----------------+
       |                  +--------------------------------------------+                               
       |                                                                                               
       |                                                                                               
       |                                                                                               
       |                                                                                               
       |                                                                                               
       |                     +------------------------------------+                                    
       |                     |           Ropsten Ethereum Testnet |                                    
       |                     |                                    |                                    
       |                     |    +-------------------------+     |                                    
       +---------------------|--> |   Scheduler Contract    |     |                                    
                             |    +-------------------------+     |                                    
                             +------------------------------------+                                    
```

## Stack

### Frontend

- Preact
- Typescript
- Jest
- Parcel
- Openzeppelin Owner Contract
- Web3
- Truffle

### Backend ([scheduler-listener project](https://github.com/felipewer/scheduler-listener))

- NodeJS
- Web3
- googleapis
- Jest
- Docker / Docker Compose

### Third Party APIs

- Infura
- Google Calendar

## How it works

- Widget is loaded into website passing configuration properties (google api key and calendar id, ethereum network id, daily time limits)
- Widget loads available times from Google Calendar
- User fills widget form with name, company, email and chosen date/time 
- On submit, widget sends "makeAppointment" transaction through web3 provider (e.g. Metamask)
- User confirms transaction
- Scheduler contract's makeAppointment function is run on the Ethereum network. All it does is to emit the "NewAppointment" event
- Meanwhile the scheduler listener process has been running somewhere (e.g. Amazon EC2) with a subscription on the Scheduler contract's events
- Once the listeners sees a "NewAppointment" event it validates all fields, checks if the chosen time is free, generates a `appear.in` room address by hashing the event fields and finally registers a new google calendar event

## Deployment

Run `npm run build` and then copy the `dist/scheduler-widget.js` file to within your website folder structure. Load it with a deferred script tag so as to make sure the web3 object already has been injected.