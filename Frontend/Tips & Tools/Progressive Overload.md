- Much needed for a promotion/ CV Update/ Interviews
- Just start it right when a challenge arises, then document it along the way
- Focus more on the IMPACT (especially ***meaningful*** ones) rather than the output just for the sake of getting something done.
- Have the STAR method as your guidelines (master the Art of Storytelling)
- Update every month/quarter
- Make a summary of **highest-impact** checkpoint - the works that you're most proud of, after a year of working (or before switching to a new company)
- Make YOUR achievements sound like they're bringing a meaningful change for your team/company/community (i.e. if you have time, try to write a dramatic STORY)
---
### Tell me about yourself
- Go in this order: 
	1. Current Role, current work responsibility
	2. College: my background is in computer science. I did my undergrad at HCMUE and...
	3. Post College: Intership, isolation
	4. Current Role: after college, I wanted to get some exposure to larger corporations so I joined FPT as a developer. It was a great experience. I learned a ton about...
	5. Outside of Work: a bit about hobbies, adventurous,...
	6. Wrap Up: I'm looking now for something new, and your company caught my eye. I've always loved the connection with the user, and I really want to be a part of a great team.


### FPT
- Biggest flex: refractor code to embrace React design pattern && readability. 
	- E.g. refractor repeated code:
```jsx
// sonarlint(javascript:S1871)
// returning exact same thing for 2 conditions:
case inputType.DATE:
        if (item['key'] === 'dateOfBirth')
          return (
            <DatePicker
              className={styles['date-picker']}
              format="DD/MM/YYYY"
              onChange={(_date, stringDate) => {
                form.setFieldsValue(`${item['key']}`, stringDate);
              }}
              disabledDate={(current) => current && current > moment().endOf('day')}
            />
          );

        if (item['key'] == 'ptpTime' && showPTPTime)
          return (
            <DatePicker
              className={styles['date-picker']}
              format="H:mm DD-MM-YYYY"
              onSelect={setSelectedDate}
              onChange={(_date, stringDate) => {
                form.setFieldsValue(`${item['key']}`, stringDate);
              }}
              showTime={{
                hideDisabledOptions: true,
                disabledHours: () => {
                  if (moment().date() == selectedDate?.date()) return disHrs;
                  else return [];
                },
                disabledMinutes: () => {
                  if (
                    moment().hour() == selectedDate?.hour() &&
                    moment().date() == selectedDate?.date()
                  )
                    return disMins;
                  else return [];
                },
              }}
              disabledDate={(current) => current && current <= moment().subtract(1, 'days')}
            />
          );

        else if (item['key'] == 'recallAt' && isRecallAtChecked)
          return (
            <DatePicker
              className={styles['date-picker']}
              format="H:mm DD-MM-YYYY"
              onSelect={setSelectedDate}
              onChange={(_date, stringDate) => {
                form.setFieldsValue(`${item['key']}`, stringDate);
              }}
              showTime={{
                hideDisabledOptions: true,
                disabledHours: () => {
                  if (moment().date() == selectedDate?.date()) return disHrs;
                  else return [];
                },
                disabledMinutes: () => {
                  if (
                    moment().hour() == selectedDate?.hour() &&
                    moment().date() == selectedDate?.date()
                  )
                    return disMins;
                  else return [];
                },
              }}
              disabledDate={(current) => current && current <= moment().subtract(1, 'days')}
            />
          );

// Refractored to:
case inputType.DATE:
        if (item['key'] === 'dateOfBirth')
          return (
            <DatePicker
              className={styles['date-picker']}
              format="DD/MM/YYYY"
              onChange={(_date, stringDate) => {
                form.setFieldsValue(`${item['key']}`, stringDate);
              }}
              disabledDate={(current) => current && current > moment().endOf('day')}
            />
          );
        if (
          (item['key'] == 'ptpTime' && showPTPTime) ||
          (item['key'] == 'recallAt' && isRecallAtChecked)
        )

          // <DatePicker/> with time:
          return (
            <DatePicker
              className={styles['date-picker']}
              format="H:mm DD-MM-YYYY"
              onSelect={setSelectedDate}
              onChange={(_date, stringDate) => {
                form.setFieldsValue(`${item['key']}`, stringDate);
              }}
              showTime={{
                hideDisabledOptions: true,
                disabledHours: () => {
                  if (moment().date() == selectedDate?.date()) return disHrs;
                  else return [];
                },
                disabledMinutes: () => {
                  if (
                    moment().hour() == selectedDate?.hour() &&
                    moment().date() == selectedDate?.date()
                  )
                    return disMins;
                  else return [];
                },
              }}
              disabledDate={(current) => current && current <= moment().subtract(1, 'days')}
            />
          );
```
- Wired up APIs to work with my new UI
- Extension (new design): refractor legacy code using Antd `<ProTable/>` to use f2p `<Table/>`
- IAM Tables
- Use a hidden wrapper component (usually a `div`) to manipulate state (`/components/SelectMultiple`):
```jsx
<Select
      open={showDropDown}
      onBlur={() => {
        if (!isFocusSelect) {
          setShowDropDown(false);
        }
      }}
      dropdownRender={(menu) => (
        <div
          onMouseEnter={() => setIsFocusSelect(true)}
          onMouseLeave={() => setIsFocusSelect(false)}
        >
		{/*...Some more jsx*/}
        </div>
      )}
    >
      {renderSelectOptions()}
    </Select>
```
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
	        unreadNotis: unreadNotis ,
	        isSeenAll: isSeenAll
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

- Beware calling API inside of a loop (leads to state being updated but API hasn't return):
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


- Should extract a component to a separate module if all of its code is more than 169 lines
- What's hard:
	- FE: Async (i.e. to display the right thing at the right time) && Render stability (no flash of content)
	- BE: Scalability && Stability
	- Softskill: to practice true reciprocity
- Specific challenging situation:
	- Root cause of my problems: much ambiguity (mostly due to ppl not working at their assigned role) & no docs for the code base
	- Edit modal for campaigns (which I had to re-confirm my task midway through)
	- OT coz someone else's fault (which works at the time but then bugs poped up later)
	- Implement notis with ws
	- Single handedly built the entire frontend for the report tool (Ability to work independently with clear planning and strict timeline)
	- "I focus excessively on details" can be damaging if there are tight deadlines.
	- The job was slowly but surely becoming solitary, which is not good for improving the softskills
-------

### Story time
 - It's not about "dumbing down" our solutions, it's about optimizing for clarity. The clearer the code is, the quicker we'll be able to fix bugs and ship new features.
- Anw, a part of me has to die. But it's the conscious aim that decides which direction will give birth to a better me.
- Sitting still in our seats, we nonetheless act out a multitude of alternate realities, extending ourselves experimentally, testing multiple potential paths, before specifying the one we will actually take
- Tasks/challenges are are neither clear nor self-evident, objectively. They must be established practically, pragmatically, and they retain their validity only under very narrow and specified conditions. The conscious illusion of complete and sufficient perception only sustains itself, for example—only remains sufficient for our purposes—when everything goes according to plan. Under such circumstances, what we see is accurate enough, so that there is no utility in looking farther.
- In a crisis, when our thing no longer goes, we turn to those whose expertise far transcends ours to restore the match between our expectant desire and what actually happens.
- The World Is Simple Only When It Behaves. When things go wrong, chaos ensues. When things break down, what has been ignored rushes in. When things are no longer specified, with precision, the walls crumble, and chaos makes its presence known. Everything becomes unreliable. Therefore, I have to speak the truth to myself, earn trust with myself to carry myself in chaos.
- What you least want will inevitably happen—and when you are least prepared. What you least want to encounter will make itself manifest when you are weakest and it is strongest. And you will be defeated.
- Coding reflects real life very closely: If you identify things, with careful attention and language, you bring them forward as viable,obedient objects, detaching them from their underlying near-universal interconnectedness. Yousimplify them. You make them specific and useful, and reduce their complexity. You make itpossible to live with them and use them without dying from that complexity, with its attendantuncertainty and anxiety. If you leave things vague, then you’ll never know what is one thing andwhat is another. Everything will bleed into everything else. This makes the world too complexto be managed.
- It's more fascinating about journeying voluntarily into the unknown - the heroic path - the noble goal. The willingness to take on that responsibility is identical to the decision to live a meaningful life.
- If we each live properly, we will collectively flourish.
- Alongside our wish to be free of rules, we all search for structure.
- As unfamiliar and strange as it sounds, in the deepest part of our psyche, we all want to be judged.
- I noted that the nature of such meaning was constantly re-presented in the great stories of the past, and that it had more to do with developing character in the face of suffering than with happiness.
- What shall I do next year? Try to ensure that the good I do then will be exceeded only by the good I do the year after that.
- Aim continually at Heaven while you work diligently on Earth.
- Always place your becoming above your current being. That means it is necessary to recognize and accept your insufficiency, so that it can be continually rectified. That’s painful, certainly—but it’s a good deal.
- To give is to do what you can to make things better. The good in people will respond to that, and support it, and imitate it, and multiply it, and return it, and foster it, so that everything improves and moves forward
- What is new is also what is exciting, compelling, and provocative, assuming the rate at which it is introduced does not intolerably undermine and destabilize our state of being
- You need to have a hierarchy of improvement, and that means you're gonna be lesser than ppl who already attained along that dimension, so, it's necessary to have some humility and to have your improvements measured/judged by the structure of social institution so you can rightfully hone your skills. 
- [Watch this](https://www.youtube.com/watch?v=IInaPtwdNCQ)
- Venture out into the dangerous but promising unknown world and discover what is there.

---
## What to tell
### 1
- Every story requires a starting place that is not good enough and an ending place that is better
- Notice your errors and misconceptions along the way, face them, and correct them. Get your stories straight.
- Life is what repeats. And it's worth getting what repeats right. 
### 2
- The ultimate question of Man is not who we are, but who we could be.
- d
- d
### 3
- d
- d
- d

## What to ask
### 1
- d
- d
- d
### 2
- d
- d
- d
### 3
- d
- d
- d
