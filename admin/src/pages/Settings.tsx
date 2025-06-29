import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Field,
  TextInput,
  Textarea,
  Loader,
  Typography,
  Flex,
  Grid,
  GridItem,
} from '@strapi/design-system';
import CenteredLoader from '../components/CenterLoader';

const Settings = () => {
  const [propertyId, setPropertyId] = useState('');
  const [measurementId, setMeasurementId] = useState('');
  const [credentials, setCredentials] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/strapi-google-analytics-dashboard/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setPropertyId(data.propertyId || '');
          setMeasurementId(data.measurementId || '');
          setCredentials(JSON.stringify(data.credentials || {}, null, 2));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    try {
      await fetch('/api/strapi-google-analytics-dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          measurementId,
          credentials: JSON.parse(credentials),
        }),
      });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings. Check your JSON credentials.');
    }
  };

  if (loading) return <CenteredLoader />;

  return (
    <Box padding={8} background="neutral0" shadow="tableShadow" hasRadius>
      <Flex direction="column" alignItems="stretch" gap={4} maxWidth="600px">
        <Typography variant="beta" as="h2">
          Google Analytics Settings
        </Typography>
        <Field.Root
          id="propertyId"
          hint="Enter your Google Analytics Property ID."
        >
          <Field.Label>GA Property ID</Field.Label>
          <TextInput
            label="Property ID"
            name="propertyId"
            onChange={(e: any) => setPropertyId(e.target.value)}
            value={propertyId}
          />
          <Field.Hint />
        </Field.Root>
        <Field.Root
          id="measurementId"
          hint="Measurement ID is optional but recommended for enhanced tracking."
        >
          <Field.Label>GA Measurement ID</Field.Label>
          <TextInput
            label="Measurement ID"
            name="measurementId"
            onChange={(e: any) => setMeasurementId(e.target.value)}
            value={measurementId}
          />
          <Field.Hint />
        </Field.Root>

        <Field.Root id="credentials" hint="Paste your Google Analytics Service Account JSON here.">
          <Field.Label>GA Service Account JSON</Field.Label>
          <Textarea
            label="GA Service Account JSON"
            name="credentials"
            onChange={(e: any) => setCredentials(e.target.value)}
            value={credentials}
            rows={10}
          />
          <Field.Hint />
        </Field.Root>

        <Button onClick={saveSettings}>Save</Button>
      </Flex>
    </Box>
  );
};

export default Settings;
