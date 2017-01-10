function journal(state = {
  isFetching: false,
  isWriting: false,
  enteringGrateful: false,
  entry: {},
}, action) {
  switch (action.type) {
    case 'JOURNAL_ENTRY_REQUEST':
      return { ...state,
        isFetching: true,
        isWriting: false,
      };
    case 'JOURNAL_ENTRY_SUCCESS':
      return { ...state,
        isFetching: false,
        isWriting: true,
        errorMessage: '',
        entry: action.entry,
      };
    case 'JOURNAL_ENTRY_FAILURE':
      return { ...state,
        isFetching: false,
        isWriting: false,
        errorMessage: action.message,
      };
    case 'JOURNAL_ENTRY_START':
      return { ...state,
        isFetching: false,
        isWriting: true,
        errorMessage: '',
        entry: {
          _id: action.newId,
          created_at: action.createdAt,
        },
      };
    case 'JOURNAL_ENTRY_SAVING':
      return { ...state,
        isSaving: true,
      };
    case 'JOURNAL_ENTRY_SAVED':
      return { ...state,
        isSaving: false,
        entry: action.entry,
      };
    case 'STUCK_SELECTED':
      return { ...state,
        entry: { ...state.entry,
          isStuck: action.isStuck,
        },
      };
    case 'GRATEFUL_SELECTED': {
      return { ...state,
        enteringGrateful: action.gratefulId,
      };
    }
    case 'GRATEFUL_ENTERED': {
      return { ...state,
        entry: { ...state.entry,
          grateful: action.gratefulArr,
        },
        enteringGrateful: false,
      };
    }
    default:
      return state;
  }
}

export default journal;
