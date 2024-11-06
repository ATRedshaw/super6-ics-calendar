const axios = require('axios');
const fs = require('fs');
const path = require('path');

// URL of the Super 6 API endpoint
const API_URL = 'https://api.s6.sbgservices.com/v2/round';

// Function to format date in YYYYMMDDTHHMMSSZ format for .ics
const formatDate = (dateString) => {
    return new Date(dateString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

// Function to generate the .ics content from API data
const generateICSContent = (rounds) => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n';

    rounds.forEach((round) => {
        const startDate = formatDate(round.startDateTime);
        const endDate = formatDate(round.endDateTime);
        icsContent += `BEGIN:VEVENT\n`;
        icsContent += `UID:${round.id}@super6.com\n`;
        icsContent += `DTSTAMP:${startDate}\n`;
        icsContent += `DTSTART:${startDate}\n`;
        icsContent += `DTEND:${endDate}\n`;
        icsContent += `SUMMARY:Super 6: Round ${round.id} deadline\n`;
        icsContent += `END:VEVENT\n`;
    });

    icsContent += 'END:VCALENDAR';
    return icsContent;
};

// Main function to fetch data and generate the .ics file
const generateCalendarFile = async () => {
    try {
        // Fetch data from the Super 6 API
        const response = await axios.get(API_URL);
        const rounds = response.data;

        // Generate the .ics file content
        const icsContent = generateICSContent(rounds);

        // Write the content to an .ics file
        const filePath = path.join(__dirname, 'super6-calendar.ics');
        fs.writeFileSync(filePath, icsContent, 'utf8');

        console.log(`ICS file generated at ${filePath}`);
    } catch (error) {
        console.error('Error generating ICS file:', error.message);
    }
};

// Run the function
generateCalendarFile();
