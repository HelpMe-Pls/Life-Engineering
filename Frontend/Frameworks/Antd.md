- `<ProForm />` with dynamic fields:
```tsx
<ProForm
	onFinish={async (values: API.ProductInput) => handleAddProduct(values)}>
		<ProFormGroup>
			<ProFormText name='name' label='Name' required />
			<ProFormText name='tenantId' label='Tenant ID' required />
			<ProFormText name='serviceId' label='Service ID' required />
			<ProFormGroup title='Variants'>
				<ProFormList name='variants'>
						<ProFormText name='id' label='ID' />
						<ProFormGroup title='Skus'>
						<ProFormList name='skus'>
							<ProFormText name='priceUnit' label='Price Unit' />
							<ProFormText
								name='displayQuantity'
								label='Display Quantity'
							/>
							<ProFormGroup title='Tiered Rates'>
								<ProFormList name='tieredRates'>
										<ProFormGroup key='group'>
											<ProFormText name='startAmount' label='Start Amount' />
											<ProFormText name='unitPrice' label='Unit Price' />
										</ProFormGroup>
								</ProFormList>
							</ProFormGroup>
						</ProFormList>
					</ProFormGroup>
				</ProFormList>
			</ProFormGroup>
			<ProFormGroup title='Settings'>
				<ProFormList name='settings'>
					<ProFormGroup key='group'>
						<ProFormText name='key' label='Key' />
						<ProFormText name='serviceId' label='Service ID' />
						<ProFormText name='value' label='Value' />
						<ProFormText name='type' label='Type' />
					</ProFormGroup>
				</ProFormList>
			</ProFormGroup>
		</ProFormGroup>
		<ProFormSwitch
			width='md'
			name='enabled'
			label='Enable'
			initialValue={false}
		/>
</ProForm>
```