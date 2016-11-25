namespace utils
{

	export function applyDefaults<T>(input:T, defaults:T):T
	{
		for(var attr in defaults)
		{
			if(defaults.hasOwnProperty(attr) && !input.hasOwnProperty(attr))
				input[attr] = defaults[attr];
		}

		return input;
	}

}