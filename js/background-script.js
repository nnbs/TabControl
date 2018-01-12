

var highlightIndex;
var highlightID;
var leftID;

const TabControl = {
	async init () {
		highlightIndex = -1
		browser.tabs.onRemoved.addListener(this.tabs_OnRemoved.bind(this))
		browser.tabs.onActivated.addListener(this.tabs_onActivated.bind(this))
		browser.tabs.onMoved.addListener(this.tabs_onMoved.bind(this))
		browser.tabs.onCreated.addListener(this.tabs_onCreated.bind(this))

		await browser.tabs.query({currentWindow: true, active: true}).then(
			(tabs) => {
				this.log_highlight(tabs[0])
			}
		)
	},
	update_leftID() {
		var queryIndex = highlightIndex - 1
		if(highlightIndex == 0)
			queryIndex = 1
		browser.tabs.query({currentWindow: true, index: queryIndex}).then(
			(result) =>  {
				tabInfo = result
				leftID = tabInfo[0].id
			}
		)
	},
	log_highlight(tabInfo) {
		highlightIndex = tabInfo.index
		highlightID = tabInfo.id
		this.update_leftID()
	},
	tabs_onActivated(activeInfo) {
		browser.tabs.get(activeInfo.tabId).then(this.log_highlight.bind(this))
	},
	tabs_OnRemoved(tabId, removeInfo) {
		if(highlightID == tabId) {
			//console.log(leftID)
			browser.tabs.update(leftID, {active: true})
		}
	},
	tabs_onMoved(tabId, moveInfo) {
		highlightIndex = moveInfo.toIndex
		highlightID = tabId

		this.update_leftID()
	},
	tabs_onCreated(tabinfo) {
		if(highlightIndex >= 0) {
			browser.tabs.move(tabinfo.id, {index: highlightIndex+1})
		}
	}
}

TabControl.init()

