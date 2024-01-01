[[Annual Review]]
[[Self Authoring]]

- Much needed for a promotion/ CV Update/ Interviews
- Just start it right when a challenge arises, then document it along the way
- Focus more on the IMPACT (especially ***meaningful*** ones) rather than the output just for the sake of getting something done. Explain your trajectory/decisions **in terms of the value** you bring to others. You need to make it clear it’s not about you; it’s more about the value you bring.
- Have the STAR method as your guidelines (master the Art of Storytelling)
- Update every month/quarter
- Make a summary of **highest-impact** checkpoint - the works that you're most proud of, after a year of working (or before switching to a new company)
- Make YOUR achievements sound like they're bringing a meaningful change for your team/company/community (i.e. if you have time, try to write a dramatic, intriguing STORY - the one with ups and downs, how you handle unexpected situations and make good use of opportunities - then spar it it in casual conversations)
> If you can connect the dots between your past, present, and future; identify the underlying themes in your career trajectory; and explain the **unique** value you can bring to your new endeavor, you’re winning.
---

### FPT
- VDONG
	- Remove/add some fields, set fixed first 2 rows, table pagination, implement ws subscription with `stompjs` (CampaignManagement)
	- Fix styling overflow for ReportDetail page, remove/add some fields, call corresponding APIs & conditional rendering for fixed campaigns
	- PopUp UI Customer Info: `<Radio.Group/>`, disable date/time, send data `onCallTerminated`
		- Remember to guard API call based on data availability (with `if` statement or default value)
	- Noti with ws: 
		- Show/hide independent notis (with "Callback" btn)
		- Scrollable notis (in the Bell)
		- Dispatch initial state right from where you get the response from ws so that you can have stable rendering on the server (also be mindful of `useEffect` deps would be nice)
		- If you want to set a state which *comes from the store*, you SHOULD use `dispatch` (not a local `useState`) or there'd be "Lúc có lúc ko đmm" bug on the server
```jsx
// In ws handler file:
//...
socket.onmessage = async (e) => {
    const response = JSON.parse(e.data);
    const isValidNotiData = response && Array.isArray(response);
  
    const unreadNotiCount = isValidNotiData && response.filter((e) => e.seen === false).length;
    const isSeenAll = (isValidNotiData && response.every((e) => e.seen === true)) || false;
    
    if (isValidNotiData) {
      dispatch({
        type: 'callNotification/save',
        payload: { 
	        unreadNotis,
	        isSeenAll
	    },
      }); 
//...

// In jsx file:
function CallbackNotifications(props) {
  const { unreadNotiCount, setBadgeCount } = props;
  
  return (
	  <Badge count={unreadNotiCount} offset={[-18, 3]} size="small">
          <BellFilled
            onClick={setBadgeCount}
            style={{ cursor: 'pointer', margin: '0 18px', fontSize: '20px', color: 'white' }}
          />
      </Badge>
  );
  //...
}

function mapStateToProps(state) {
  const { callNotification } = state;
  return {
    unreadNotiCount: callNotification.unreadNotiCount,
    //...
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setBadgeCount: () =>
      dispatch({
        type: 'callNotification/save',
        payload: {
          unreadNotiCount: 0,
        },
      }),
  };
}

export default connect(mapStateToProps)(CallbackNotifications);
```

> Beware calling API inside of a loop (leads to state being updated but API hasn't return):
```jsx
const isShowBagde = [{id: 'rand0mstr1ng', seen: true}, ...]

// DON'T do this:
const handleIsRead = async (item) => {
    const updatedSeenState = isShowBadge.map((e) => {
      if (e.id === item.id) {
        await requestUpdatedSeenState(item.id);
        e.seen = true;
      }
      return e;
    });
    setIsShowBadge(updatedSeenState);
  };

// DO this instead:
const handleIsRead = async (item) => {
    try {
      const res = await requestUpdatedSeenState(item.id);
      if (res.status) {
        item.seen = true;
      } else
        return notification.error({
          message: 'Unable to update seen state for this notification.',
        });
    } catch (err) {
      console.log('ERROR:', err);
    }
    // Use functional state update here to make sure the state is synchronized
    setIsShowBadge((prevSeenState) =>
      prevSeenState.map((state) => (state.id === item.id ? item : state)),
    );
  };
```

- Use tmp variable to set state instead of using `setState` multiple times:
```jsx
// Show/hide noti based on PopUpCall modal mounted state: 

const { isPopupModalOpen } = popupCall    // boolean state from Redux' store
const [agentCallRinging, toggleAngentCallRinging] = useState(false);
const [missedCall, setMissedCall] = useState([]);
const [callbackCall, setCallbackCall] = useState([]);

useEffect(() => {
	// have a temp variable to handle state:
    let missedCallStateToBeSet, callbackCallToBeSet;
    
    if (notiData && Array.isArray(notiData)) {    // `notiData` from store
      missedCallStateToBeSet = notiData.filter(
        (item) => item.type === 'MISSED_CALL' && item.available,
      );
      callbackCallToBeSet = notiData.filter(
        (item) => item.type === 'CALLBACK_CALL' && item.available,
      );
    }

    if (isPopupModalOpen || agentCallRinging) {
      missedCall.map((item) => notification.close(item.id));
      callbackCall.map((item) => notification.close(item.id));
      missedCallStateToBeSet = [];
      callbackCallToBeSet = [];
    }
    
    setMissedCall(missedCallStateToBeSet);
    setCallbackCall(callbackCallToBeSet);

  }, [notiData, isPopupModalOpen, agentCallRinging]);

  useEffect(() => {
    missedCall.map((item) =>
      notification.open({
        key: item.id,
        //...jsx content
      }),
    );
  }, [missedCall]);

  useEffect(() => {
    callbackCall.map((item) =>
       notification.open({
        key: item.id,
        //...jsx content
      }),
    );
  }, [callbackCall]);

```

- `import {Title} from 'antd'` leads to a vague, time consuming error. To fix it:
```js
import {Typography} from 'antd'

const {Title} = Typography
``` 

 - Error handling and attempting to get data straight from API in case getting state from store is failed:
```js
async function doSome () {
	try {
      if (companyId)    // get from store
        ws(
          companyId,
          JSON.stringify({
            page: 0,
            size: 10,
            where: {
              isDeleted: { $ne: true },
              scenarioName: { $regex: `.*${valueSearch}.*`, $options: 'i' },
            },
            sort: { updatetime: -1 },
          }),
          moment(dateSelect.startTime).format('YYYY-MM-DD'),
          moment(dateSelect.endTime).format('YYYY-MM-DD'),
        );
      // get from API  
      else {
        const loginData = await requestLoginFworkByToken();
        if (loginData && loginData.success && loginData.data) {
          const userData = await requestCheckDomain({ email: loginData.data.email });
          ws(
            userData.result.company_id,
            JSON.stringify({
              page: 0,
              size: 10,
              where: {
                isDeleted: { $ne: true },
                scenarioName: { $regex: `.*${valueSearch}.*`, $options: 'i' },
              },
              sort: { updatetime: -1 },
            }),
            moment(dateSelect.startTime).format('YYYY-MM-DD'),
            moment(dateSelect.endTime).format('YYYY-MM-DD'),
          );
        }
      }
    } catch (err) {
	      console.log(err);
	      notification.error({ message: `You fucked up!` });
    }
}
```
- Export button:
```jsx
const onExportHistory = async (campaignId) => {
    try {
      const fixedCampaign = {
        campaignId,
        companyId,
      };
      const fixedCampaignRes = await requestExportHistoryFixedCampaign(fixedCampaign);

      if (fixedCampaignRes) {
        const downloadURL = window.URL.createObjectURL(
          new Blob([fixedCampaignRes], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        );
        const downloadLink = document.createElement('a');

        downloadLink.href = downloadURL;
        downloadLink.setAttribute('download', `History of ${campaignId} Campaign`);

        document.body.appendChild(downloadLink);
        downloadLink.click();
      } else throw new Error(fixedCampaignRes.error || 'Unable to export campaign history.');
    } catch (err) {
      console.error(err.toString());
      return notification.error({
        message: `${formatMessage({
          id: 'pages.campaign-management.export.fixed.campaigns.fail',
        })}`,
      });
    }
    return null;
  };
  
<Button onClick={onExportHistory}>
	Import
</Button>
```
- Import button:
```tsx
	const handleImport = async (file: File) => {
		try {
			const res: ImportFileResponse = await axios({
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access-token')}`,
				},
				method: 'post',
				url: `${import.meta.env.PUBLIC_SERVICE_CONTROL}/import`,
				data: file,
			})
			if (res && res.data.success) {
				setSuccess(true)
			}
		} catch (err) {
			setError({ ...error, fromImport: true })
			return
		}
	}

	const uploadSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement
		if (event.target.files !== null && event.target.files.length > 0) {
			const file = target.files[0]
			handleImport(file)
		}
	}

	<Button variant="contained" sx={{ mb: '2rem' }} component="label">
				Import
				<input
					hidden
					id="upload-file"
					accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					type="file"
					onChange={uploadSelectedFile}
				/>
	</Button>
```

- **Event-driven programming**: events are determined by user actions, sensor outputs, or messages from other programs. Events are monitored in an [[Async#Event Loop |event loop]], and when an event occurs, a callback function associated with that event is executed. This approach is asynchronous and non-blocking, meaning that if an event triggers a service and starts reacting to the event, it will not block other services from running or reacting.
- Should extract a component to a separate module if all of its code is more than 169 lines or is called $\geqslant$ 3 times. 
- What's hard:
	- FE: Async (i.e. to display the right thing at the right time) && Render stability (no flash of content)
	- BE: Scalability && Stability
	- Softs skill: deep listening & be very mindful of your reactions
- Specific challenging situation:
	- Root cause of my problems: much ambiguity (mostly due to ppl not working at their assigned role) & no docs for the code base
	- Edit modal for campaigns (which I had to re-confirm my task midway through)
	- No automated tests >> latent bugs
	- Implement notis with ws
	- Single handedly built the entire frontend for the report tool (Ability to work independently with clear planning and strict timeline)
	- "I focus excessively on details" can be damaging if there are tight deadlines.
	- The job was slowly but surely becoming solitary, which is not good for improving the soft skills
- What you'd like to be more proficient at:
	- Complex API states handling
	- Security: XSS, encode URL params
	- a11y
	- i18n
	- Native mobile
-------
## Behavioral - What to tell
- Long story short, it was not what I wanted, but definitely is what I needed.
- Being a Software Engineer is just getting paid to figure out things you have no idea how to do.
### VDONG
- Without any prior experience, joining a company of such reputation, I surely had high expectations. I was expecting a cutting-edge tech stack (because that was what I spent a year to prepare for) with the most efficient procedures for our development cycles and of course, someone reliable to learn from.
	- But instead, I joined a project whose frontend was pushing around the devs (because most of them are fullstack devs with a lean on backend) and the tech stack was kind of peculiar. We were using a Chinese React stack with Umi as the frontend framework using a kind of Redux-saga as state management approach, Antd as the UI framework and LESS to style the components.
	- So as you might've guessed, I was assigned as a frontend dev with a lot of tasks to catch up with the upcoming tight deadlines. On top of that, our team didn't have a qualified development process either. We had no project manager, and our DevOps guy somehow assumed the role of the manager. We operated based on some kind of a heuristic approach and there was no documentation whatsoever. I know it's hard to believe such an arrangement exists within a company of such scale, but that's what it was. 
	  So I was like, me ? what the hell do I know about Umi and all of this unheard-of stack ? And it was the very first time I faced reality: The World Is Simple Only When It Behaves. When things are no longer specified, with precision, the walls crumble, and chaos makes its presence known. Everything becomes unreliable. Naive and feared of incapable for the role, I was overthinking so much, looking down on myself and keep telling myself that I couldn't do this, I'm definitely incompetent and this is too much for a fresher like me. 
- Fortunately, the guy sitting next to me has been there long enough to know his way through the project and he's kinda more well-rounded fullstack than the rest of the team. Thanks to him, I was able to get myself together and hit the ground and running. Following a divide and conquer approach, he helped me break up my tasks into manageable sub-tasks and carefully prioritize them. I also learnt from him how to generalize a solution to solve a problem and its neighbors, you know, to write maintainable code.
- WebSocket eli5: provides a way to exchange data between browser and server via a persistent connection. The data can be passed in both directions as “packets”, without breaking the connection and the need of additional `HTTP` requests. WebSocket objects are cross-origin by nature. When a `new WebSocket(url)` is created, the browser (using headers, in a `HTTP` request) asks the server: “Do you support WebSocket?” And if the server replies “yes” (by sending a code `101` response), then the connection is upgraded and continues in WebSocket protocol:
	- Methods:
		- `socket.send(data)`,
		- `socket.close([code], [reason])`.
	- Events:
		- `onopen` – connection established,
		- `onmessage` – data received,
		- `onerror` – socket error,
		- `onclose` – connection closed.
- Another fun story is that, right around the end of my probation, I got covid, which was kinda weird, coz as far as I remember, during the peak of the pandemic, everyone around me had it, and I was the only one made it through without being "positive". But then when everything is back to normal, and no one seems to have it, then I got caught. It was mild, thanks to the vaccine perhaps? And to my surprise, shortly after recovering from covid, I was involved in a in a bike crash, due to my own ignorance. I was rushing to make it to work on time on a rainy day, and as I turning a corner, the slippery street caused the accident. Luckily, I ended up with just a few scratches on my skin, nothing too serious. But those 2 events were definitely a quick reminder of how fragile life is and the importance of putting care in our actions.
- As a surprise, the project somehow managed to be delivered, even though the feedback was kinda on the negative side. As expected, team members couldn't put up with what was going on, and they eventually left, resulting in our team size being cut in half. All that happened within the first 3 months of my career, and also the most eventful period I've ever been through in a workplace. It was not what I wanted nor expected, but definitely what I needed. To conclude, I'd say a fine combination of gratitude and courage is what keep me going and it's almost always more fascinating about journeying *voluntarily* into the unknown - the heroic path - the noble goal. The willingness to take on that responsibility is identical to the decision to live a meaningful life.

### Transitions
- Company re-org
- Take advantage of company perks such as sponsored Coursera && MS, AWS certs,...
- I was reluctant to learn DSA, but as I forced myself through it, I realized it's an endeavor that requires a rare blend of precision and creativity. It can certainly be frustrating at times, but it's also highly addictive.

### Report
- Lead frontend using Astro & MUI
- Poor man's deployment >> Could be better using Docker, Vercel, AWS EC2
- Raise manday request

### Autocall
- Lead frontend using Next13 & Tailwind
- Tell how you cooked up a tl;dr NextJS Obsidian docs 
- Persuade how nextjs 13 (with default caching and server components) is better than previous versions with server components:
	- You can fetch data inside your components, and it Just Works™. No more `useEffect()` that are common with client-side fetching.
	- You can stream data using `<Suspense>` to speed up the initial page load.
	- You can execute more code on the server without shipping it to the client, keeping bundle sizes smaller.

### WIL
- If you're indeterminate, Life will happen *to* you instead of happen *for* you. Do not allow that. You gotta take the wheel.
- Trust in your own ability
	- Always place your becoming above your current being. It's less about what you know and more about your ability to adapt. That means it is necessary to recognize and accept your insufficiency, so that it can be continually rectified. That’s painful, certainly—but it’s a good deal.
	- The idea is you operate on the level of what you want to be as well as you possibly can.
	- Once you learned how to set your goals properly, with care, you'll slowly but certainly realize that you're capable of doing the things that you once thought "there's no way I can do that". And that's a walloping realization.
- Learned how to learn
	- What is new is also what is exciting, compelling, and provocative, assuming the rate at which it is introduced does not intolerably undermine and destabilize our state of being.
	- Alongside our wish to be free of rules, we all search for structure and validations from others. As unfamiliar and strange as it sounds, in the deepest part of our psyche, we all want to be judged. It's hard to deny that when you built something beautiful and take pride in it.
	- You need to have a hierarchy of improvement, and that means you're gonna be lesser than ppl who already attained along that dimension, so, it's necessary to have some humility and to have your improvements measured/judged by the structure of social institution so you can rightfully hone your skills. 
	- To give is to do what you can to make things better. The good in people will respond to that, and support it, and imitate it, and multiply it, and return it, and foster it, so that everything improves and moves forward.
- Learned to be prepared, even if nothing's going wrong and everything seems right.
	- What you least want will inevitably happen—and when you are least prepared. What you least want to encounter will make itself manifest when you are weakest and it is strongest. And you will be defeated.
- I noted that the nature of such meaning was constantly re-presented in the great stories of the past, and that it had more to do with developing character in the face of suffering than with happiness.
- Every story requires a starting place that is not good enough and an ending place that is better.

