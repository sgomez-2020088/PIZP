import Report from './report.model.js'

export const addReport = async (req, res) =>{
    try {
        let data = req.body
        const userId = req.user.id
        data.user = userId

        let report = new Report(data)

        await report.save()
        const reportPopulated = await Report.findById(report._id)
            .populate('user', 'name surname email -_id')

        
        return res.status(201).send({ message: 'Report added successfully', success: true, reportPopulated })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Generarl error adding report', success: false })
    }
}

export const getReports = async (req, res) => {
    try {
        const reports = await Report.find()
        .populate('user', 'name surname email DPI')
        
        return res.status(200).send({ message: 'Reports retrieved successfully', success: true, reports })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error retrieving reports', success: false })
    }
}
//DPI

export const deleteReport = async (req, res) => {
    try {
        const {reportId} = req.params

        const deletedReport = await Report.findByIdAndDelete(reportId)
        if(!deletedReport) return res.status(404).send({message:'report not founded', succes: false})
            return res.status(200).send({message:'Report deleted successfully', success: true})
    

    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'General error deleting report', success: false})        
    }
}

