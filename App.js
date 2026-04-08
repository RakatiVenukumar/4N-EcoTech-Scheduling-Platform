import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
	return (
		<AuthProvider>
			<AppNavigator />
		</AuthProvider>
	);
};

export default App;