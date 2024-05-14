import React, { Component } from 'react';

class TodoSwitchScreen extends Component {
    render() {
        const { isCompletedScreen, onSwitchScreen } = this.props;
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
}

export default TodoSwitchScreen;