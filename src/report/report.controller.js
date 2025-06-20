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

const updatedReports = reports.map(report => {
            let color = '#f8d890'

            switch (true) {
                case ['Secuestro', 'Homicidio', 'Violación', 'Desaparición forzada'].includes(report.typeCrime):
                    color = '#ff2828'
                    break

                case ['Asalto', 'Extorsión', 'Trafico de drogas'].includes(report.typeCrime):
                    color = '#ff8328'
                    break

                case ['Acoso', 'Amenazas', 'Violencia doméstica'].includes(report.typeCrime):
                    color = '#ffd128'
                    break
            }

            return {
                ...report.toObject(),
                severityColor: color
            }
        })

        
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

