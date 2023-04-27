[[Tips & Tools/Meta]]
[[Interview prep]]
[[Best practices]]

- Check for empty object: 
```jsx
// Render this component only when `detailCampaign` object has data:
{Object.keys(detailCampaign).length > 0 && (
        <CardLayout
          title={<FormattedMessage id="pages.campaign-management.campaign.info" />}
          icon={<InfoCircleFilled style={{ color: '#526eff' }} />}
        >
          <CampaignInfo detailCampaign={detailCampaign} phoneCall={phoneCall} />
        </CardLayout>
)}
```

- Centering trick with 1 side having content [in flex layout](https://github.com/css-for-js/sole-and-ankle/commit/ad2863febfccdcc58d87e5ad5210b2ebfcd2faf8) by using  *`flex: 1`  elements* to squeeze your desired center content.