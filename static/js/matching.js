class TeamMatcher {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        // 验证至少选择一个位置
        if (!player.roles.length) {
            throw new Error('至少选择一个位置！');
        }
        this.players.push(player);
    }

    matchTeams() {
        let teams = [];
        let remainingPlayers = [...this.players];

        while (remainingPlayers.length > 0) {
            let currentTeam = [];
            let neededRoles = ['top', 'jungle', 'mid', 'support', 'adc'];

            // 尝试填充一个完整的队伍
            for (let role of neededRoles) {
                let playerIndex = remainingPlayers.findIndex(
                    player => player.roles.includes(role)
                );

                if (playerIndex !== -1) {
                    currentTeam.push(remainingPlayers[playerIndex]);
                    remainingPlayers.splice(playerIndex, 1);
                }

                // 如果没有找到对应位置的玩家，继续下一个位置
                if (currentTeam.length >= 5 || remainingPlayers.length === 0) {
                    break;
                }
            }

            // 将剩余玩家填充到队伍中，直到达到5人或没有更多玩家
            while (currentTeam.length < 5 && remainingPlayers.length > 0) {
                currentTeam.push(remainingPlayers.shift());
            }

            teams.push(currentTeam);
        }

        return teams;
    }
}

// 事件监听器
document.getElementById('playerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const player = {
        id: formData.get('playerId'),
        rank: formData.get('rank'),
        roles: Array.from(formData.getAll('roles'))
    };

    try {
        window.teamMatcher = window.teamMatcher || new TeamMatcher();
        window.teamMatcher.addPlayer(player);
        alert('玩家添加成功！');
        e.target.reset();
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('startMatching').addEventListener('click', function() {
    if (!window.teamMatcher || window.teamMatcher.players.length === 0) {
        alert('请先添加玩家！');
        return;
    }

    const teams = window.teamMatcher.matchTeams();
    displayTeams(teams);
});

function displayTeams(teams) {
    const container = document.createElement('div');
    container.className = 'teams-container';

    teams.forEach((team, index) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        teamDiv.innerHTML = `
            <h3>队伍 ${index + 1}</h3>
            <ul>
                ${team.map(player => `
                    <li>
                        ID: ${player.id} | 
                        段位: ${player.rank} | 
                        位置: ${player.roles.join(', ')}
                    </li>
                `).join('')}
            </ul>
        `;
        container.appendChild(teamDiv);
    });

    // 清除之前的结果并显示新结果
    const existingContainer = document.querySelector('.teams-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    document.body.appendChild(container);
}