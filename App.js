import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { AppointmentProvider } from './src/context/AppointmentContext';

const App = () => {
	return (
		<AuthProvider>
			<AppointmentProvider>
				<AppNavigator />
			</AppointmentProvider>
		</AuthProvider>
	);
};

export default App;