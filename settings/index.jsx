function startup(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Nurse Burnout Settings</Text>}>
        <TextInput
          settingsKey="userid"
          label="User ID"
        />
        <Toggle
          settingsKey="continuousUpload"
          label="Continuous Data Upload"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(startup);