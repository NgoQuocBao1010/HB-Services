def remove_none_values(input_dict):
    """
    Remove keys with None values from the input dictionary.
    """
    return {key: value for key, value in input_dict.items() if value is not None}
