import { Box, Text } from "ink";
import React from "react";

const HelpApp: React.FC = () => {
	return (
		<Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
			<Box marginBottom={1} justifyContent="center">
				<Text bold color="cyan">✨ SALAT CLI GUIDE ✨</Text>
			</Box>

			<Box flexDirection="column" marginBottom={1}>
				<Text bold underline>Usage:</Text>
				<Text>  $ salat [command] [options]</Text>
			</Box>

			<Box flexDirection="column" marginBottom={1}>
				<Text bold underline>Commands:</Text>
				<Box marginLeft={2} flexDirection="column">
					<Box>
						<Box width={20}><Text color="yellow">times [city]</Text></Box>
						<Text>Show prayer times (default)</Text>
					</Box>
					<Box>
						<Box width={20}><Text color="yellow">guide</Text></Box>
						<Text>Show this rich help page</Text>
					</Box>
					<Box>
						<Box width={20}><Text color="yellow">cities</Text></Box>
						<Text>Display the list of available city names</Text>
					</Box>
				</Box>
			</Box>

			<Box flexDirection="column" marginBottom={1}>
				<Text bold underline>Options:</Text>
				<Box marginLeft={2} flexDirection="column">
					<Box>
						<Box width={20}><Text color="green">-1, --once</Text></Box>
						<Text>Run once and exit</Text>
					</Box>
					<Box>
						<Box width={20}><Text color="green">-v, --version</Text></Box>
						<Text>Show version</Text>
					</Box>
					<Box>
						<Box width={20}><Text color="green">-h, --help</Text></Box>
						<Text>Show standard text help</Text>
					</Box>
				</Box>
			</Box>

			<Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1}>
				<Text italic color="gray">Example:</Text>
				<Text color="white">  $ salat Rabat --once</Text>
				<Text color="white">  $ salat guide</Text>
			</Box>

			<Box marginTop={1} justifyContent="flex-end">
				<Text color="gray">Tip: Press Ctrl+C to exit the live timer.</Text>
			</Box>
		</Box>
	);
};

export default HelpApp;
