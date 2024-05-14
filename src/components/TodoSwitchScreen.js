import React from 'react';

function TodoSwitchScreen({ isCompletedScreen, onSwitchScreen }) {
    return (
        <div className="btn-area">
            <button
                className={`isCompletedScreen ${!isCompletedScreen ? 'active' : ''}`}
                onClick={() => onSwitchScreen(false)}
            >
                Todo
            </button>
            <button
                className={`isCompletedScreen ${isCompletedScreen ? 'active' : ''}`}
                onClick={() => onSwitchScreen(true)}
            >
                Completed
            </button>
        </div>
    );
}

export default TodoSwitchScreen;